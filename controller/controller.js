const myModel = require("../model/model")
const val = require("../helpers/validator")
const bcrypt = require("bcrypt")
const sendEmail = require("../helpers/email")
const dynamicHtml = require('../helpers/html')
const jwt = require('jsonwebtoken')

const port = process.env.port

exports.createUser = async (req,res)=>{
try{
const data = {
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email.toLowerCase(),
    number:req.body.number,
    password:req.body.password 
}
await val.validateAsync(data,(err,data)=>{
if(err){
    res.json(err.message)
}else{
    res.json(data)
}
})
const saltedPassWord = bcrypt.genSaltSync(10)

const hashPassWord = bcrypt.hashSync(data.password,saltedPassWord)
const user = await new myModel(data)

const {firstName, lastName, email, id} = user
const userToken = await jwt.sign({firstName, lastName, email, id}, process.env.secret, {expiresIn: "200s"})

user.password=hashPassWord
user.token = userToken
await user.save()

const link = `http://localhost:${port}/updateuser/${user.id}/${user.token}`
const html = dynamicHtml(link, user.firstName)
sendEmail({
email:user.email,
subject:"Kindly verify your email", 
html
 

})

res.status(200).json({
    message:`user with email ${user.email} is created`,
    data:user
})
}catch(err){
    res.status(500).json(err.message)
}
}

exports.verify = async (req,res)=>{
 try{
    
       const  id = req.params.id
       const userToken = req.params.userToken
    
    const updatedUser = await myModel.findByIdAndUpdate(id, {isVerified: true}, {new: true})
    await jwt.verify(userToken, process.env.secret )

    res.status(200).json({
        message:`user with emmail:${updatedUser.email} is now verified`,
        data: updatedUser
    })
 }catch(err){
    res.status(500).json({
        error: err.message
    })
 }

}
exports.home = (req ,res)=>{
res.json("welcome api")
}

exports.getOne = async (req, res)=>{
    try{
        id = req.params.id
        const user = await myModel.findById(id)

        res.status(200).json({
            message: `User with email: ${user.email} fetched successfully`,
            data: user
        })
    }
    catch(err){
        res.status(500).json({
            message: `Cannot get use: ${err.message}`
        })
    } 
}


exports.logIn = async (req, res) =>{
    try{
        const {email, password} = req.body
        const emailExists = await myModel.findOne({email: email.toLowerCase()})
        
        if(!emailExists){
            return res.status(404).json({
                message: `user not found`
            })
        } 
        
        const passExists = bcrypt.compareSync(password, emailExists.password)

        if(passExists === false){
            return res.status(400).json({
                message: `You entered an incorrect password`
            }) 
        }

        const token = await jwt.sign({
            userId: emailExists._id,
            email: emailExists.email
        }, process.env.secret, {expiresIn:"1d"})
        emailExists.token = token

        await emailExists.save()
        
        res.status(200).json({
            message: `Login successful`,
            emailExists

        }) 
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

exports.updateUser = async (req, res, next) => {
    try{
        const id = req.params.id
        const data = {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            number:req.body.number,
        }

        const user = await myModel.findByIdAndUpdate(id, data, {new:true})

        if(!user){
            return res.status(404).json({
                message: 'This user does not exist',
            })
        }

        res.status(200).json({
            message: `User with email: ${user.email} has been updated successfully`,
            user
        })

    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
}


exports.signOut = async (req, res) => {
    try {
        const id = req.params.id;
        const token = req.body.token;

        const user = await myModel.findByIdAndUpdate(id, { token: null }, { new: true });

        res.status(200).json({  
            message: `User logged out successfully`,
            user
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

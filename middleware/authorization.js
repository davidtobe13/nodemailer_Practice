const jwt = require('jsonwebtoken')
const myModel = require('../model/model')
require('dotenv').config()

// const authorization = async (req, res, next) => {
//     try{ 
//         const token = req.params.token

//         const decodedToken = jwt.verify(token, process.env.secret)

//         const user = await myModel.findById(decodedToken.userId)

//         if(!user){
//             return res.status(404).json({
//                 message: 'Authentication failed: User not found'
//             })
//         }

//         if(user.token === null){
//             return res.status(403).json({
//                 message: 'This user is logged out'
//             })
//         }

//         next()

//     }catch(error){
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }




const authorization = async (req, res, next) => {

    try{
        const id = req.params.id;

        const user = await myModel.findById(id);
    if(!user){
        return res.status(404).json({
            message: 'Authorization failed. No user found'
        })
    }
    const token = user.token;

    if(token === null){
        return res.status(404).json({
            message: 'This user is logged out'
        });
    }

    jwt.verify(token, process.env.secret, (err, payLoad) =>{
        if(err){
            return res.json({
                message: 'Session expired'
            })
        }
        else{
            req.user = payLoad
        }
    })
    
    next()
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = authorization
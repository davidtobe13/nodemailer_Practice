const dotenv=require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");
//console.log(process.env.mailpassword)
const sendEmail=async(options)=>{
const transporter = nodemailer.createTransport({

 service:process.env.service,
  auth: {
    
    user:process.env.user ,
    pass:process.env.mailpass,
  }, 
});

let mailOption={
    from:process.env.user,
    to:options.email,
    subject:options.subject,
    // text:options.text
    html: options .html
}

await transporter.sendMail(mailOption)
}
module.exports=sendEmail
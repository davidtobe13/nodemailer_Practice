const express = require('express');
const app = express();
app.use(express.json());

const router = require('./router/router')
app.use('/api/v1/user', router)


const mongoose = require('mongoose');


const dotenv = require('dotenv');
dotenv.config()

const port = process.env.port
const db = process.env.link

mongoose.connect(db)
.then(()=>{
    console.log(`Database connection successfully extablished`);
    app.listen(port, ()=>{
        console.log(`This server is listening on port: ${port}`);
    })
})
.catch((err)=>{
    console.log(`Database connection error: ${err.message}`);
})
const express = require('express');
const router = express.Router()
const {createUser, verify, getOne, logIn, updateUser, signOut} = require('../controller/controller');
const authorization = require('../middleware/authorization');


router.post('/createuser', createUser)

router.put('/verifyuser/:id/:userToken', verify)

router.get('/getone/:id', getOne)

router.put('/updateuser/:id', authorization, updateUser)

router.post('/login', logIn)

router.put('/signout/:id', signOut)


module.exports = router  

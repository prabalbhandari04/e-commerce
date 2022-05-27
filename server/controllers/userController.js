const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body
            
            if(!name || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid emails."})

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = {
                name, email, password: passwordHash
            }
            
            await newUser.save()

            const createdUser = await Users.create(newUser)
            
            res.status(201).json({msg: "User created successfully.", user: createdUser})



            res.json({msg: "Register Success! Please activate your email to start."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
    
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}



module.exports = userController
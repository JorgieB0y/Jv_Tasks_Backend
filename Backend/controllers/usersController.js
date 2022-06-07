// Import User schema to User Controller
import { query } from "express";
import generateID from "../helpers/generateID.js";
import generateJWT from "../helpers/generateJWT.js";
import User from "../models/User.js";
import { registrationEmail, passwordResetEmail } from '../helpers/emails.js'

// Async register method to post user on Database
const register = async (req, res) => {

    // Avoid duplicate emails
    const { email } = req.body; // get email field from the body of the request
    const existingUser = await User.findOne({email: email}) // Use findOne method to search for the email 

    if (existingUser) {
        // Create new error if existingUser evaluates to true
        const error = new Error('User has already been registered');
        return res.status(400).json({message: error.message}) // set status response to 400 
    }

    try {
        // Define new user object
        const user = new User(req.body);
        user.token = generateID();
        // Await to store the user in the database
        await user.save()
        // Send confirmation Email via nodemailer + mailtrap.io
        registrationEmail({
            email: user.email,
            name: user.name,
            token: user.token
        });
        // Respond with the new stored user
        res.json({ message: 'User created succesfully, please confirm your Email account!'});
    } catch (error) {
        // Print any error
        console.log(error)
        res.json({ message: `User could not be created. Error: ${error.message}`})
    }
}

// Authenticate User Method
const authenticate = async (req, res) => {
    
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({email});
    
    if (!user) {
        const error = new Error('User does not exist!')
        return res.status(404).json({message: error.message});
    }

    // Check if the user has confirmed account
    if (!user.confirmed) {
        const error = new Error('User has not confirmed account!')
        return res.status(403).json({message: error.message});
    }

    // Check user password
    if (await user.checkPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id)
        })
    } else {
        const error = new Error('Incorrect Password!')
        return res.status(403).json({message: error.message});
    }
    // Let user in
    console.log(user)
}

// Confirm user method
const confirmUser = async (req, res) => {
    const { token } = req.params // get token from the request parameters (url)

    const confirmUser = await User.findOne({token}); // fetch user by token 

    if (!confirmUser) { /*If user doesn't exist*/
        const error = new Error('Invalid user token')
        return res.status(403).json({message: error.message});
    } 

    try {
        confirmUser.confirmed = true; // Toggle confirmation status to true
        confirmUser.token = "" // Reset JWT user token
        await confirmUser.save() // Update user on Mongo with Save
        
        res.json({
            message: "User confirmed succesfully!"
        })

    } catch (error) {
        console.log(error)
    }
}

// Password reset method
const resetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({email});
    
    if (!user) {
        const error = new Error('User does not exist!')
        return res.status(404).json({message: error.message});
    }

    try {
        
        user.token = generateID()
        await user.save()
        res.json({
            message: "Password reset has been sent to email address"
        })

        passwordResetEmail({
            email: user.email,
            name: user.name,
            token: user.token
        });
    } catch (error) {
        console.log(error)
    }
}

// Validate user password token 
const testToken = async (req, res) => {
    const { token } = req.params;
    
    const validToken = await User.findOne({token});

    if (validToken) {
        res.json({message: "Valid user token"})
    } else {
        const error = new Error('Invalid user token, please try again')
        res.status(404).json({ message: error.message })
    }
}

// Change user password
const changePassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({token});

    if (user) {
        user.password = password;
        user.token = "";
        
        try {
            await user.save();
            res.json({ message: "Password was changed succesfully" })
        } catch (error) {
            res.json({ message: `${error.message}` })
            console.log(`There was an error saving the password: ${error.message}`)
        }

    } else {
        const error = new Error('Invalid user token, please try again')
        res.json({ message: error.message })
    }
}

// Get user profile 
const profile = async (req, res) => {
    const { user } = req;

    res.json(user);
}

export {
    register,
    authenticate,
    confirmUser,
    resetPassword,
    testToken,
    changePassword,
    profile,
}
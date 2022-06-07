import express from "express";
import { 
        register, 
        authenticate, 
        confirmUser, 
        resetPassword, 
        testToken, 
        changePassword,
        profile
    } from '../controllers/usersController.js'
import { checkAuth } from '../middleware/checkAuth.js'

const router = express.Router();

// Authentication, Register and Confirmation of Users
router.post('/', register) // Create new User
router.post('/login', authenticate) // Create new User
router.get('/confirm/:token', confirmUser) // Create new User
router.post('/forgot-password', resetPassword) // Send password reset to user email
router.route('/forgot-password/:token').get(testToken).post(changePassword) // Same route but runs token test on get and changePass on post
router.get('/profile', checkAuth, profile)

export default router
import mongoose from "mongoose";
import bcrypt from 'bcrypt'; /* <- Password hashing dependency*/

// Use mongoose (orm) to define our schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true /* <- 'unique will check if it already exists on db'*/
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    token: {
        type: String
    },

    confirmed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// mongoose middleware method that will run BEFORE saving it to the database
userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) {
        next(); // if password has not been modified (hashed) it will skip with next method
    }

    const salt = await bcrypt.genSalt(10); // Think of salt as the "security" level of the hash
    this.password = await bcrypt.hash(this.password, salt) // bcrypto requires the string to hash & the 'salt'
})

// Add new password checker to userSchema controller 
userSchema.methods.checkPassword = async function(formPassword) {
    // Check user password
    return await bcrypt.compare(formPassword, this.password)
}

// Define User Model
const User = mongoose.model("User", userSchema);

export default User;
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    description: {
        type: String,
        trim: true,
        required: true
    },

    status: {
        type: Boolean,
        default: false
    },

    dueDate: {
        type: Date,
        required: true,
        default: Date.now()
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project' // Has to the same referency name that was given to the Project.js model
    },

    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
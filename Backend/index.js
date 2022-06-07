// Import express from package.json & dependencies
import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// Import database file
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

// Required method to run express package & telling express we will use json
const app = express();
app.use(express.json());

// Express requires us to configure our .env via dotenv package
dotenv.config()

// Connection to the database
connectDB()

// Allow CORS domains from whitelist
const allowedOrigins = [`${process.env.FRONTEND_URL}`]

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS Error, domain not in allowed origin"))
        }
    },
};

app.use(cors(corsOptions));

// Define App Routing for our API - separate them into different files
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

// Create port to deploy online
const PORT = process.env.PORT || 4000

// App config with it's callback
const server = app.listen(PORT, () => {
    console.log(`JV tasks server running on port ${PORT}`);
});

// Create new Socket.io server
import { Server } from 'socket.io'

// connect the current app's port server
const io = new Server(server, {
    pingTimeout: 60000,
    // defined cors settings for socket
    cors: {
        origin: process.env.FRONTEND_URL,
    }
})

io.on('connection', (socket) => {
    console.log('Connected to socket io')

    socket.on('open project', (project) => {
        socket.join(project);
    })

    socket.on('create task', (task) => {
        // When a user is on the same project we emit the task to all socket connections
        socket.to(task.project).emit('created task', task)
    })

    socket.on('delete task', task => {
        console.log(task)
        socket.to(task.project).emit('deleted task', task)
    })
})
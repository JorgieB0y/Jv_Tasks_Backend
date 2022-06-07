// Mongoose ORM that works with express
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Create async connection through Mongoose to my Mongo DB Atlas Cluster (check .env)
        const connection = await mongoose.connect(process.env.MONGO_URI, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const url = `${connection.connection.host}: ${connection.connection.port}`
        console.log(`Mongo DB Connected at: ${url}`)
    } catch (error) {
        console.log(`Error= ${error.message}`)
        process.exit(1)
    }
}
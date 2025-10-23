import mongoose from "mongoose";
 
const connectDB = async() => {
    try {
        mongoose.connection.on("connectes",() => {
            console.log("connected to DB!")
        })
        await mongoose.connect(process.env.MONGODB_URI);
    } 
    catch (error) {
        console.log("DB coonection error : ", error);
        process.exit();
    }
}

export default connectDB;
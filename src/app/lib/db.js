import mongoose from "mongoose";

export async function connectDB(){
    try{
        const conn = await mongoose.connect("mongodb://localhost:27017/note-app")
    
        console.log("log =================================================")
    }
    catch(error){
        throw new Error(error)
    }
}
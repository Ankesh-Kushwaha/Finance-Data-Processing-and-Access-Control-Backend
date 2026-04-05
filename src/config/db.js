import mongoose from 'mongoose';


export const connectToDB = async ()=>{
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URL);
    console.log("DataBase connection Successfull.");
  }
  catch (err) {
    console.error("error while connecting to database", err.message);
  }
}
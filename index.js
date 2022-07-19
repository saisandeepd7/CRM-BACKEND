import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import {userRouter} from "./routes/user.js"
import cors from "cors"

dotenv.config();

const app =express();

//const PORT=process.env.PORT;
const PORT=4000

app.use(express.json());

app.use(cors()); 
//const MONGO_URL=process.env.MONGO_URL;
const MONGO_URL="mongodb://127.0.0.1"
export async function createConnection(){
    const client=new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected ")
    return client;
  }

export const client=await createConnection();

    


app.use('/',userRouter);


app.listen(PORT,()=>console.log("the server started in",PORT));

app.get("/",(request,response)=>{
    response.send("welcome to CRM APP");
});

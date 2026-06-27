import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    try {
            await client.connect();
                    console.log("connected!");
                            const db = client.db("CodProDB");
                                    let collection = db.collection("orders");
        //update
       // await collection.updateMany({status: "Delivered"},{$set: {rating: 4.5}})
       //aggregate pipeline
       //$add
      /* let ar1 = await collection.aggregate([
        {
            $project: {doublePrice: {$add: ["$price","$price"]}}
        }
       ]).toArray();*/
       //$subtruct
       let ar2 = await collection.aggregate([
        {
            $project: {discount: {$subtract: ["$price",50]}}
        }
       ]).toArray();
       //$multiply
       let ar3 = await collection.aggregate([
        {
            $project: {total: {$multiply: ["$price","$quantity"]}}
        }
       ]).toArray();
       //$divide
       let ar4 = await collection.aggregate([
        {
            $project: {oneByFourth: {$divide: ["$price",4]}}
        }
       ]).toArray();
       //$floor
       let ar5 = await collection.aggregate([
        {
            $project: {nearestVal: {$floor: "$rating"}}
        }
       ]).toArray();
       //ceil
       let ar6 = await collection.aggregate([
        {
            $project: {upperVal: {$ceil: "$rating"}}
        }
       ]).toArray();
       //$round
       let ar7 = await collection.aggregate([
        {
            $project: {roundVal: {$round: "$rating"}}
        }
       ]).toArray();
       //$trunc
       let ar8 = await collection.aggregate([
        {
            $project: {integerVal: {$trunc: "$rating"}}
        }
       ]).toArray();
       //$exp
       let ar9 = await collection.aggregate([
        {
            $project: {eulerPow: {$exp: 2}}
        }
       ]).toArray();
       //$abs
       let ar10 = await collection.aggregate([
        {
            $project: {absolute: {$abs: -5}}
        }
       ]).toArray();
       //$subtruct
       let ar11 = await collection.aggregate([
        {
            $project: {power: {$pow: [2,2]}}
        }
       ]).toArray();
       //$mod
       let ar12 = await collection.aggregate([
        {
            $project: {reminder: {$mod: [10,3]}}
        }
       ]).toArray();
       
       
       console.log(ar8)
       
      //  console.log(await collection.find().toArray())

    }catch(err){
        console.log(err)
    }finally{
        await client.close()
    }
}
run();
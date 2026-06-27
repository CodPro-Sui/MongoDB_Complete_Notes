import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
        try {
                await client.connect();
                console.log("connected!");
                let s = 450;
                const db = client.db("CodProDB");

                //create capped collection
                /*let collection = await db.createCollection("logs", {
                        capped: true,
                        max: 5,
                        size: s
                });*/


                //insert data
                //  await collection.insertOne({ message: `log ${new Date()}` });
                //    console.log(await collection.find().toArray())

                //create alreadyName collection 
                //     let aldcoll = await db.createCollection("already");
                //console.log(await aldcoll.isCapped()); false


                //only update size not max
                /*  await db.command({
                      convertToCapped: "already",
                      size: s
                     });
                      //console.log(await aldcoll.isCapped()); true
      
                      */

                //to update a capped coll
                await db.command({
                        collMod: "already",
                        cappedSize: 200,
                        cappedMax: 2
                });

                let acess = db.collection("already");
                await acess.insertOne({ message: `log ${new Date()}` });
                console.log(await acess.find().toArray());
        } catch (e) {
                console.log(e)
        } finally {
                await client.close()
        }
}
run()
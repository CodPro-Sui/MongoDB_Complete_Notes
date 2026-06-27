import { MongoClient } from "mongodb";
import dotenv from "dotenv";
//performance && indexing 

dotenv.config()

const client = new MongoClient(process.env.MONGO_URL);
// what will be learn in this session?
// db.coll_name.createIndex, dropIndex("name_of_field_index") , getIndexes() , explain("executionStats"), explain()

//types
//single-field indexing
//compound index
//unique index
//text index
//wildcard index
//geospatial index
//hashed index

async function run() {
    try {
        await client.connect();

        console.log("connected 💚");
        //assign db
        const db = client.db("myApp");

        const students = db.collection("students");
        //start from here 
        console.log(await students.indexes())

        //console.log(await students.find().toArray())

        //single field indexing
        //index by name
        /*
        await students.createIndex({name: 1});
        console.log(await students.find({name: "CodPro Sui"}).explain("executionStats"))
        
       // email index
       await students.createIndex({email: -1});
       console.log(await students.find({email: "codprosui@gmail.com"}).explain("executionStats"));
    
    
          //Compound Index mean collection 
    
          // must be order follow as 
          await students.createIndex({name:1,email:1});
          console.log(await students.find({name: "CodPro Sui",email: "codprosui@gmail.com"}).explain("executionStats"));
    
          //compound index call two or more seperate index create 
          await students.dropIndex("name_1_email_1");
    
    
    //uniqe index
    
    await students.createIndex({email: 1},{unique: true});
    // prevent inserting duplicate value
    console.log(await students.find().explain("executionStats"));

        //text index

        await students.createIndex({ skills: "text" });

        console.log(await students.find({ $text: { $search: "JavaScript" } }).explain("executionStats"));


        await students.createIndex({ skills: "text" });

        console.log(await students.find({ $text: { $search: "MongoDB" } }).toArray());

       console.log(await students.find({$text: {$search : "CSS"}},{skills: 1, high_low: {$meta: "textScore"}}).sort({high_low: {$meta: "textScore"}}).toArray());


        //TTL Index
        await client.db("OTP_users").collection("otps").insertMany([
            {
                name: "Rahul",
                otp: "1234",
                createdAt: new Date()
            },
            {
                name: "Aman",
                otp: "5678",
                createdAt: new Date()
            }
        ]);

        await client.db("OTP_users").collection("otps").createIndex({createdAt: -1},{expireAfterSeconds: 10});
        
        console.log(await client.db("OTP_users").collection("otps").find().toArray());


     // wildcard index

     await students.createIndex({"$**":1});

     console.log(await students.find({name: "CodPro Sui"}).explain("executionStats"));


    //Geospatial index
 await students.insertMany([
    {
        name: "Cafe",
        location: {
            type: "Point",
            coordinates: [33.4, 27.5]
        }
    },
    {
        name: "Restaurant",
        location: {
            type: "Point",
            coordinates: [34.0, 27.6]
        }
    }
]);

await students.createIndex({ location: "2dsphere" });

let data = await students.find({
    location: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [34.0, 27.6]
            }
        }
    }
}).explain("executionStats");

console.log(data);


  // PartialFilterExpression index

  await students.updateOne({email: "codprosui@gmail.com"},{
    $set:{phone_no: "8002190737"}
  });

    await students.createIndex({phone_no:1},{partialFilterExpression:{
        phone_no: {
            exists: true
        }
    }});

    console.log(await students.find({phone_no: "8002190737"}).explain("executionStats"))


    //Sparse Index

    await students.createIndex({email:1,phone_no:1},{unique:true,sparse: true})

console.log(await students.find({email: "codprosui@gmail.com",phone_no:"8002190737"}).toArray())


//hashed Index

await students.createIndex({name: "hashed"});

//await students.insertOne({name: "cs"});

console.log(await students.find({name: "cs"}).toArray())



*/


        //end here
    } catch (error) {
        console.log(error.message)
    } finally {
        await client.close();
        console.log("disconnected!")
    }
}
run()
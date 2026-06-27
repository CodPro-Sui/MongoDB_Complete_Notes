import { MongoClient } from "mongodb";

const url = "mongodb+srv://codprogmi_db_user:sVMikTs6Uhennls6@cluster0.ojyoy47.mongodb.net/?appName=Cluster0";
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Connected ✅");
    const db = client.db("myApp");

    const students = db.collection("students");

    // create user one
    let addStudent = await students.insertOne({
      name: "CodPro Sui",
      age: 20,
      role: "Developer"
    });
    console.log(addStudent.insertedId,addStudent.acknowledged);
    
         // create multiple users
     let uploadUsers = await students.insertMany([
      {
        "name": "Aman Kumar",
        "age": 22,
        "email": "aman.kumar@example.com",
        "isActive": true,
        "skills": ["JavaScript", "Node.js", "MongoDB"],
        "address": {
          "city": "Patna",
          "state": "Bihar"
        }
      },
      {
        "name": "Priya Sharma",
        "age": 25,
        "email": "priya.sharma@example.com",
        "isActive": false,
        "skills": ["Python", "Django"],
        "address": {
          "city": "Delhi",
          "state": "Delhi"
        }
      },
      {
        "name": "Rahul Verma",
        "age": 28,
        "email": "rahul.verma@example.com",
        "isActive": true,
        "skills": ["Java", "Spring Boot"],
        "address": {
          "city": "Bangalore",
          "state": "Karnataka"
        }
      },
      {
        "name": "Sneha Gupta",
        "age": 21,
        "email": "sneha.gupta@example.com",
        "isActive": true,
        "skills": ["HTML", "CSS", "JavaScript"],
        "address": {
          "city": "Mumbai",
          "state": "Maharashtra"
        }
      },
      {
        "name": "Vikas Singh",
        "age": 30,
        "email": "vikas.singh@example.com",
        "isActive": false,
        "skills": ["C++", "Data Structures"],
        "address": {
          "city": "Lucknow",
          "state": "Uttar Pradesh"
        }
      },
      {
        "name": "Neha Patel",
        "age": 27,
        "email": "neha.patel@example.com",
        "isActive": true,
        "skills": ["React", "Redux"],
        "address": {
          "city": "Ahmedabad",
          "state": "Gujarat"
        }
      },
      {
        "name": "Arjun Mehta",
        "age": 24,
        "email": "arjun.mehta@example.com",
        "isActive": true,
        "skills": ["Go", "Microservices"],
        "address": {
          "city": "Pune",
          "state": "Maharashtra"
        }
      },
      {
        "name": "Kavita Reddy",
        "age": 29,
        "email": "kavita.reddy@example.com",
        "isActive": false,
        "skills": ["SQL", "Database Design"],
        "address": {
          "city": "Hyderabad",
          "state": "Telangana"
        }
      },
      {
        "name": "Rohit Das",
        "age": 23,
        "email": "rohit.das@example.com",
        "isActive": true,
        "skills": ["Flutter", "Dart"],
        "address": {
          "city": "Kolkata",
          "state": "West Bengal"
        }
      },
      {
        "name": "Anjali Nair",
        "age": 26,
        "email": "anjali.nair@example.com",
        "isActive": true,
        "skills": ["Angular", "TypeScript"],
        "address": {
          "city": "Kochi",
          "state": "Kerala"
        }
      }
    ]);
         console.log("ids: ", users.insertedIds);
         console.log("Counts: ", users.insertedCount);
    
         
        //getting single user on the db if exist return single db else null
         let getUser = await students.findOne({age: 20});
    
         console.log(getUser?getUser:"no found")
    
         // get all datas in arr 
         let users = await students.find().toArray();
         
         // projection parameter
         let usersRight = await students.find(
          {age: {$gt:20}},
          {projection: {email: 1,_id: 0}}
         ).toArray();
         // here in projection
         // 1 mean includ only this and returning 
         // 0 meqn excluding only this and return rest
         // exception: only for _id, in projection all should be 1 which uou want, else 0 which you don't want, mean 1,1, or 0,0, only for _id
         console.log(usersRight)
    
         
         // update 
         //update one 
         let updateUser = await students.updateOne({age: {$lt: 20}},
          {$set: {addmission: "open"}}
         );
         let findAddmission = await students.find({addmission: "open"}).toArray();
         console.log(findAddmission);
        
        //update many
        //Note: if already exist key-value then overwrite else creates
        let updateUsers = await students.updateMany({name: "CodPro Sui"},
          {$set: {network: "Global",role: "scientist"}}
        );
        console.log(updateUsers)
        

    //delete first match one
    let deleteUser = await students.deleteOne({ name: "CodPro Sui" });
    console.log(deleteUser.acknowledged ? "Deleted sucessful!" : "No Found")
    

    let deleteYounger = await students.deleteMany({age:{$lte:18}});
    console.log(deleteYounger.deletedCount > 0?"deleted younger users!":"No found");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
    console.log("disconnected!")
  }
}

run();

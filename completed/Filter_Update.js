import dotenv from "dotenv";
import { MongoClient,ObjectId } from "mongodb";

const url = "mongodb+srv://codprogmi_db_user:sVMikTs6Uhennls6@cluster0.ojyoy47.mongodb.net/?appName=Cluster0";

const client = new MongoClient(url);

async function mongo() {
    try {
        await client.connect();
        const db = client.db("myApp");
        const students = db.collection("students");

        
        //filter students by using condition 
        //comparison $lt,$gt,$lte,$gte
        //01
        //$lt
        let data1 = await students.find({age: {$lt: 25}}).toArray();
        //console.log(data1)
        //$gt
        const data2 = await students.find({age: {$gt: 25}}).toArray();
       // console.log(data2);
       //lte
       const data3 = await students.find({age:{$lte: 25}}).toArray();
       //console.log(data3)
       //gte
       const data4 = await students.find({age:{$gte:25}}).toArray();
       //console.log(data4)

       //02
       //logical operator $and,$or,$not

       const data5 = await students.find({
        $and:[
            {age:{$gte: 18}},
            {name:"Naushad Ansari"}
        ]
       }).toArray();
       // inside of $and arr all must be true
      // console.log(data5);

      const data6 = await students.find({
        $or: [
            {age: {$gte : 28}},
            {role: "Developer"}
        ]
      }).toArray();
      // match any one condition 
      //console.log(data6)

      const data7 = await students.find({
        age: {$not: {$lte: 18}}
      }).toArray();
      //$not this not operator think oposite of expression
      console.log(data7);

      const data8 = await students.find({
        $nor:[
            {age: {$lt: 20}},
            {name: "Naushad Ansari"}
        ]
      }).toArray();
      //all in arr conditions opposite behave
      console.log(data8);

      
        const data9 = await students.find({
            age: { $exists: true, $type: "int" }
        }).toArray();
        console.log(data9.length)
        // $and do it
        const data10 = await students.find({
            $and: [
                { age: { $exists: true } },
                { age: { $type: "int" } }
            ]
        }).toArray();
        console.log(data10.length);
        
       const data11 = await students.find({
        isActive: {$type: "bool"}
       }).toArray();
       console.log(data11)
       

        //03
        //Notation field find mean nested 
        const data12 = await students.find({"address.city":"Kolkata"}).toArray();
        console.log(data12)
        

        //04
        // for only in values
        //in , match any one in arr
        const data13 = await students.find({
            age: {$in : [25,26]}
        }).toArray();
        console.log(data13);
    
       //match all in array
       const data14 = await students.find({
        skills: {$all :["HTML","CSS","JavaScript"]}
       }).toArray();
       console.log(data14);
       
      const getUserById = await students.find({
        _id: new ObjectId("69e18ef533ecde6235789cd1")
      }).toArray();
      console.log(getUserById);
      

      //start chapter 2, updation
      //$set
      const set1 = await students.updateOne({name: "Naushad Ansari"},{
        $set:{
            name: "CodPro Sui"
        }
      });
      //$inc uses for increasing or decreasing of numeric val
      const set2 = await students.updateOne({name:"CodPro Sui"},{
        $inc:{age: -2}
      })
     //$push query
     await students.updateOne({name:"Aman Kumar"},{
        $push: {skills: "C programming"},
        $set: {name: "Code"}
    });
    //$pull, add this skill for delete practice 
    await students.updateOne({name:"Code"},{
        $push: {skills: "no course"},
     })
     console.log(await students.findOne({name: "Code"}));
     await students.updateOne({skills:{$in: ["no course"]}},{
        $pull:{skills: "no course"}
     });

      console.log(await students.findOne({skills:{$in: ["JavaScript"]}}));
    } catch (e) {
        console.log(e.message)
    } finally {
        await client.close();
    }
}
mongo()
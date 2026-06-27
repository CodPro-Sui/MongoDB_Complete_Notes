import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("CodProDB");
        let collection = db.collection("code");
        const usersDB = client.db("usersDB");
        let orders  = usersDB.collection("orders");
        let profile = usersDB.collection("profile");


        //format data
        /*
         name: "Rahul Sharma",
        age: 22,
        salary: 25000,
         bonus: 5000,
         tax: 2000,
         department: "IT",
         city: "Delhi",
         quantity: 2,
        price: 500,
        discount: 50,
        totalMarks: 450,
        subjects: 5*/

        /*
        //$regex
        let regex1 = await collection.find({ name: { $regex: "Sharma" } }).toArray();
        let regex2 = await collection.find({ name: { $regex: "sharma", $options: "i" } }).toArray();
        let regex3 = await collection.find({ name: { $regex: "ma"} }).toArray();
        let regex4 = await collection.find({ name: { $regex: "^S"} }).toArray();
        let regex5 = await collection.find({ name: { $regex: "a$"} }).toArray();
        
       //$expr
       let expr1 = await collection.find({$expr: {$gt: ["$salary","$bonus"]}}).toArray();
       let expr2 = await collection.find({$expr: {$gt:["$age","$subjects"]}}).toArray();
       let expr3 = await collection.find({$expr: {$eq: ["$age",23]}}).toArray();
      console.log(expr3)
      
      //$mod
      let mod1 = await collection.find({age: {
        $mod: [2,0]
      }}).toArray();
      let mod2 = await collection.find({age: {
        $mod: [2,1]
      }}).toArray();

      let mod3 = await collection.find({age: {$mod: [4,3]}}).toArray();
      console.log(mod3)
      

      //aggregate
      //$add
      let add1 = await collection.aggregate([
        {
            $project:{
                newField: {$add: ["$salary","$bonus"]}
            }
        }
      ]).toArray();
      let add2 = await collection.aggregate([
        {
            $project:{
                totalPrice: {$multiply: ["$price","$quantity"]}
            }
        }
      ]).toArray();
      let add3 = await collection.aggregate([
        {
            $project:{
                exactPay: {$subtract: [{$multiply: ["$price","$quantity"]},"$discount"]}
            }
        }
      ]).toArray();
      let add4 = await collection.aggregate([
        {
            $project:{
                oneSubjectMarks: {$divide: ["$totalMarks","$subjects"]}
            }
        }
      ]).toArray();
      console.log(add4)

     //findOneAndUpdate()
    let f1= await collection.findOneAndUpdate({name: "Aman Verma"},{$set: {name: "Naushad Ansari"}},{returnDocument: "after"});
    let f2 = await collection.findOneAndUpdate({name: "CodPro Sui"},{$set: {role: "Developer"},$inc: {age: 18}},{upsert: true,returnDocument: "after"})
   //let f3 = await collection.findOneAndUpdate({age: {$lte:20}},{$set: {age: {$inc: 1}}},{sort: {age: 1},projection: {name: 1,_id:0}})
    let f4 = await collection.findOneAndUpdate({name: "kalu"},{$set: {age: 20,work: "any"}},{upsert: true, returnDocument:"after"});
   console.log(f4)

     //findOneAndDelete()
    let d1 = await collection.findOneAndDelete({name:"kalu"})
    console.log(d1); // return deleted docs while deleteOne not return docs they return acknowledgement

      
// $lookup
   let res = await orders.aggregate([
    {$lookup:{
        from: "profile",
        localField: "userId",
        foreignField: "_id",
        as: "storeData"
    }},
    {
        $unwind: "$storeData",
    },
    {
        $unwind: "$userOrders"
    },
    {
        $replaceRoot:{
            newRoot:{
                $mergeObjects: ["$$ROOT","$storeData"]
            }
        }
    },
    {
        $project: {storeData: 0}
    }
   ]).toArray();
   //$unwind work like loop in js 
//understand flow
//lookup -> get data from foreign if matched local and foreign -> $unwind loop each time for docs in loop and pnt item
//$replaceRoot the replace docs entire
//$$NOW current time

   console.log(res)



// insert data for loop in aggregate
await collection.insertOne(
    {
  name: "CodPro",
  age: 20,
  city: "Patna",
  marks: [78, 82, 91],
  skills: ["React", "MongoDB", "Node"],
  hobbies: ["Coding", "Chess"],
  salary: 25000,
  bonus: 5000,
  projects: [
    {
      title: "Ecommerce",
      tech: ["React", "Node"],
      completed: true
    },
    {
      title: "Chat App",
      tech: ["Socket.io", "MongoDB"],
      completed: false
    }
  ]
},

   //for loop done as $unwind === already done
   //map loop by $map
   //addField
   let mapLoop1 = await collection.aggregate([
    {
        $match:{
            marks: {$exists: true}
        }
    },
    {
        $project: {
            tanOutOf: {
                $map:{
                    input: "$marks",
                    as: "n",
                    in:{
                        $divide: ["$$n",10]
                    }
                }
            }
        }
    }
   ]).toArray();
console.log(mapLoop1)

let filteLoop = await collection.aggregate([
    {
        $match:{
            marks: {$exists: true}
        }
    },
    {
        $project:{
            sortValue:{
                $filter:{
                    input: "$marks",
                    as: "n",
                    cond:{
                        $gt: ["$$n",80]
                    }
                }
            }
        }
    }
]).toArray();

console.log(filteLoop);


//reduce method loop
let totalMarks = await collection.aggregate([
    {
        $match:{
            marks: {$exists: true}
        }
    }
    ,
    {
        $project: {
            totalMarks: {
                $reduce: {
                    input: "$marks",
                    initialValue: 0,
                    in:{
                        $add: ["$$value","$$this"]
                    }
                }
            }
        }
    }
]).toArray();

console.log(totalMarks)

//range loop
let rangeLoop = await collection.aggregate([
    {
        $match: {
            marks: {$exists: true}
        }
    },
    {
        $project:{
            rangeOnetoTen: {
                $map: {
                    input: {
                        $range: [1,11],
                    },
                    as : "n",
                    in: {
                        $multiply: ["$$n",10]
                    }
                }
            }
        }
    }
]).toArray();
console.log(rangeLoop)


//onle generate range 1 to 15

let rangeDefine = await collection.aggregate([{
    $project: {
        range : {
            $range: [1,16]
        }
    }
}]).toArray();
console.log(rangeDefine)

await collection.updateOne({
    city: "Patna"
},{$set: {
    matrix: [
    [1,2],
    [3,4]
  ]
}})
console.log("done")*/

//2d traverse

let multipleWithTwo = await collection.aggregate([
    {
        $match:{
            matrix: {$exists:true}
        }
    }
    ,
    {
        $project: {
            multipleTwo:{
                $map: {
                    input: "$matrix",
                    as: "row",
                    in:{
                        $map: {
                            input: "$$row",
                            as: "num",
                            in:{
                                $multiply: ["$$num",2]
                            }
                        }
                    }
                }
            }
        }
    }
]).toArray();
console.dir(multipleWithTwo,{depth: null})




    } catch (error) {

        console.log(error);
    } finally {
        client.close();
    }
};
run();

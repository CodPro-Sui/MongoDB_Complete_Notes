import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
//const url = "mongodb+srv://codprogmi_db_user:sVMikTs6Uhennls6@cluster0.ojyoy47.mongodb.net/?appName=Cluster0";

const client = new MongoClient(process.env.MONGO_URL);

async function run() {
  try {
    await client.connect();
    console.log("Successful connected 💚");
    //data save first
    let db = client.db("signup");
    let users = db.collection("users");

    
    //add
    const add = await users.insertOne({
      name: "Naushad Ansari",
      age: 24,
      email: "suicodpro@gmail.com",
      createdAt: new Date(),
    });
    console.log(add.acknowledged ? "Created!" : "faild");

    //start
    //eg age = [1,2,3,4,5] 1 mean low to high,-1 mean hight to low
    //sort()
    const getAllUsers = await users.find().sort({ age: 1 }).toArray();
    console.log(getAllUsers);

    // descending  by -1 of age key
    const getAllUsersBySortedReverse = await users
      .find()
      .sort({ age: -1 })
      .toArray();
    console.log(getAllUsersBySortedReverse);

    // now acceding by createdAt use 1
    const getAllUsersBySortedReverseByTime = await users
      .find()
      .sort({ createdAt: 1 })
      .toArray();
    console.log(getAllUsersBySortedReverseByTime);
    //descending by createdAt key-1
    const getAllUsersBySortedReverseByTimeReverse = await users
      .find()
      .sort({ createdAt: 1 })
      .toArray();
    console.log(getAllUsersBySortedReverseByTimeReverse);

    //sort by multiple value
    //Note: 1st field = primary sorting
    //2nd field = tie-breaker (only when values are same)
    //db.users.find().sort({ age: 1, name: -1 })
    // First → sort all users by age
    // Then → ONLY where age is same → sort by name
    const sortMul = await users.find().sort({ name: -1, age: 1 }).toArray();
    console.log(sortMul);

    //skip()
    const remain = await users.find().skip(2).toArray();
    console.log(remain);

    //limit() method
    const limitUsers = await users.find().limit(3).toArray();
    console.log(limitUsers);

    //pagination
    //mean each page append fix size data 5 each page
    //formula skip = (page - 1) * limit
    const page = 3,
      limit = 2;
    const pagination = await users
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    console.log(pagination);

    //uses all in one
    
   //conditions:
    //- age <= 30
    //- sort ascending order, if two users value same year then next only next condition apply ascending order alphabet 
    //- skip first 1
    //- append limit 4, fix each page
    
    let all = await users
      .find({ age: { $lte: 30 } })
      .sort({ age: 1, name: 1 })
      .skip(1)
      .limit(4)
      .toArray();
    console.log(all);


    //aggregation pipeline 
    //match,sort,limit,skip,project,count,sortByCount,sample

    //$match as like find() method
    const result1 = await users.aggregate([
      {$match: {age : {$gte : 18}}}
    ]).toArray();
    console.log(result1);


    //$sort
    const result2 = await users.aggregate([
      {$match : {age : {$lte: 25}}},
      {$sort: {age: 1,name: 1}}
    ]).toArray();
    console.log(result2);


   //$limit
    const result3 = await users.aggregate([
      {$match : {age : {$lte: 25}}},
      {$sort: {age: 1,name: 1}},
      {$limit : 3}
    ]).toArray();
    console.log(result3);

    // $skip
    const result4 = await users.aggregate([
      {$match : {age : {$lte: 25}}},
      {$sort: {age: 1,name: 1}},
      {$limit : 3},
      {$skip: 1}
    ]).toArray();
    console.log(result4);

    //$project

    const result5 = await users.aggregate([
      { $match: { age: { $lte: 25 } } },
      { $sort: { age: 1, name: 1 } },
      { $limit: 5 },
      { $skip: 1 },
      { $project: { name: 1, age: 1, _id: 0, isAdult: { $gte: ["$age", 18] } } }
    ]).toArray();
    console.log(result5);


    //$count
    const result6 = await users.aggregate([
      {$match : {age : {$lte: 25}}},
      {$sort: {age: 1,name: 1}},
      {$limit : 10},
      {$skip: 0},
      {$project : {name: 1,age: 1,_id:0,isAdult: {$gte : ["$age", 18]}}},
      {$count : "Size"}
    ]).toArray();
    console.log(result6[0]?.Size);

   //$sortByCount
   // _id become common found and its length become count N
    const result7 = await users.aggregate([
      {$match : {age : {$lte: 25}}},
      {$sort: {age: 1,name: 1}},
      {$limit : 10},
      {$skip: 0},
      {$project : {name: 1,age: 1,_id:0,isAdult: {$gte : ["$age", 18]}}},
      {$sortByCount: "$age"}
    ]).toArray();

    //cut: {$count : "name"} here
    console.log(result7);


   //sample mean return random user based on size limit
   const result8 = await users.aggregate([
    {$sample: {size: 3}}
   ]).toArray();
   console.log(result8);
   
   //======================================================
    //$Group pipeline

    //$ sum avg median max min count push addToSet First Last Top Bottom TopN BottomN
    const g1 = await users.aggregate([{
      $group: {
        _id: "$age",
        count: { $sum: "$age" }
      }
    }]).toArray();
    //sum which age same group
    console.log(g1)
    //sum all user age
    const g2 = await users.aggregate([{
      $group: {
        _id: null,
        count: { $sum: "$age" }
      }
    }]).toArray();
console.log(g2)

//group based average age
const g3 = await users.aggregate([{
      $group: {
        _id: "$age",
        average: { $avg: "$age" }
      }
    }]).toArray();
console.log(g3)
//average age for all users
const g4 = await users.aggregate([{
      $group: {
        _id: null,
        all_users: { $avg: "$age" }
      }
    }]).toArray();
console.log(g4)

//group based median
const g5 = await users.aggregate([{
      $group: {
        _id: "$age",
        median: { $median: {
          input: "$age",
          method: "approximate"
        } }
      }
    }]).toArray();
console.log(g5)
//median age from all users
const g6 = await users.aggregate([{
      $group: {
        _id: null,
        all_users_median: { $median: {
          input: "$age",
          method: "approximate"
        }}
      }
    }]).toArray();
console.log(g6)

    //group based max age
    const g7 = await users.aggregate([{
      $group: {
        _id: "$age",
        max_age: { $max: "$age" }
      }
    }]).toArray();
    console.log(g7)
    //max age for all users
    const g8 = await users.aggregate([{
      $group: {
        _id: null,
        max_age: { $max: "$age" }
      }
    }]).toArray();
    console.log(g8)
    

    //group based min age
    const g9 = await users.aggregate([{
      $group: {
        _id: "$age",
        min_age: { $min: "$age" }
      }
    }]).toArray();
    console.log(g9)
    //min age for all users
    const g10 = await users.aggregate([{
      $group: {
        _id: null,
        min_age: { $min: "$age" }
      }
    }]).toArray();
    console.log(g10)
    

    //group based count same age
    const g11 = await users.aggregate([{
      $group: {
        _id: "$age",
        count_age: { $count: {} }
      }
    }]).toArray();
    console.log(g11)
    //count all users
    const g12 = await users.aggregate([{
      $group: {
        _id: null,
        count_age: { $count: {} }
      }
    }]).toArray();
    console.log(g12)
  


    //group push
    const g13 = await users.aggregate([{
      $group: {
        _id: "$age",
        same_age: { $push: "$name"}
      }
    }]).toArray();
    console.log(g13)
    //push for all users
    const g14 = await users.aggregate([{
      $group: {
        _id: null,
        all_users: { $push: "$name" }
      }
    }]).toArray();
    console.log(g14)

    //$ geyy all info of users $$ROOT
    const g15 = await users.aggregate([
      {
        $group:{
          _id:"$age",
          users_full_info: {$push : "$$ROOT"}
        }
      }
    ]).toArray();
    console.log(g15)

    //addToSet works similer as puah but unique store in arr
    const g16 = await users.aggregate([{
      $group: {
        _id: "$age",
        users_age_name_unique: { $addToSet: "$name" }
      }
    }]).toArray();
    console.log(g16)
    //max age for all users
    const g17 = await users.aggregate([{
      $group: {
        _id: null,
        unique_age_name: { $addToSet: "$name" }
      }
    }]).toArray();
    console.log(g17)
    
    //first lowest age
    const g18 = await users.aggregate([{$sort: {age : 1}},{
      $group: {
        _id: "$age",
       first_u : { $first: "$name" },
       last_u: {$last: "$name"}
      }
    }]).toArray();
    console.log(g18)
    //max age for all users
    const g19 = await users.aggregate([{$sort: {age: 1}},{
      $group: {
        _id: null,
        first_u: { $first: "$name" },
        last_u: {$last: "$name"}
      }
    }]).toArray();
    console.log(g19)
    

    //Top and topN
    const g20 = await users.aggregate([{
      $group: {
        _id: "$age",
        top: { $top: {
          output: ["$name","$age","$email"],
          sortBy: {age: 1}
        } }
      }
    }]).toArray();
    console.log(g20)
    //max age for all users
    const g21 = await users.aggregate([{
      $group: {
        _id: null,
        top: { $top: {
          output: ["$name"],
          sortBy: {age: 1}
        }}
      }
    }]).toArray();
    console.log(g21)


    const g22 = await users.aggregate([{
      $group: {
        _id: "$age",
        top: { $topN: {
          output: ["$name","$age","$email"],
          sortBy: {age: 1},
          n: 2
        } }
      }
    }]).toArray();
    console.log(g22)
    //max age for all users
    const g23 = await users.aggregate([{
      $group: {
        _id: null,
        top: { $topN: {
          output: ["$name"],
          sortBy: {age: 1},
          n: 2
        }}
      }
    }]).toArray();
    console.log(g23)

    //bottom and bottomN

    const g24 = await users.aggregate([{
      $group: {
        _id: "$age",
        bottom: {
          $bottom: {
            output: ["$name", "$age", "$email"],
            sortBy: { age: -1 }
          }
        }
      }
    }]).toArray();
    console.log(g24)
    //max age for all users
    const g25 = await users.aggregate([{
      $group: {
        _id: null,
        bottom: {
          $bottom: {
            output: ["$name"],
            sortBy: { age: -1 }
          }
        }
      }
    }]).toArray();
    console.log(g25)

    

    //bottomN

    const g26 = await users.aggregate([{
      $group: {
        _id: "$age",
        bottom: { $bottomN: {
          output: ["$name","$age","$email"],
          sortBy: {age: -1},
          n:2
        } }
      }
    }]).toArray();
    console.log(g26)
    //max age for all users
    const g27 = await users.aggregate([{
      $group: {
        _id: null,
        bottom: { $bottomN: {
          output: ["$name"],
          sortBy: {age: -1},
          n: 2
        }}
      }
    }]).toArray();
    console.log(g27)
  } catch (error) {
    console.log(error.message);
  } finally {
    await client.close();
  }
}
run();

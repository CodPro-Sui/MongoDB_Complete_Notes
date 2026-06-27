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
        let order = db.collection("orders");
        let sales = db.collection("sales");

        //await collection.updateOne({name: "CodPro Sui"},{$set: {age: 19}});


        /*
                //$bucket
                //fixed size of bucket and size length
                let rangeTotalMarks = await collection.aggregate([
                    {
                        $match: {
                            totalMarks: { $exists: true }
                        }
                    },
                    {
                        $bucket: {
                            groupBy: "$totalMarks",
                            boundaries: [0, 300, 450, 500],
                            default: "defaultVal",
                            output: {
                                count: { $sum: 1 },
                                names: { $push: "$name" }
                            }
                        }
                    }
                ]).toArray();
        
        
                //agg by group and collect salary
                let salery = await collection.aggregate([
                    {
                        $match: {
                            age: { $exists: true },
                            city: { $exists: true }
                        }
                    },
                    {
                        $bucket: {
                            groupBy: "$age",
                            boundaries: [15, 30, 45],
                            default: "otherAge",
                            output: {
                                name: { $push: "$name" },
                                city: { $push: "$city" },
                                totalRevenueThisAge: { $sum: "$salary" }
                            }
                        }
                    }
                ]).toArray();
        
                //bucketAuto create buckets based on buckets size
                let sizeByBucket = await collection.aggregate([
                    {
                        $match: {
                            salary: { $exists: true }
                        }
                    },
                    {
                        $bucketAuto: {
                            groupBy: "$salary",
                            buckets: 3,
                            output: {
                                name: { $push: "$name" }
                            }
                        }
                    }
                ]).toArray();
        
        
                //$addFeild
                let newField = await collection.aggregate([
                    {
                        $match: {
                            totalMarks: { $exists: true }
                        }
                    },
                    {
                        $addFields: {
                            status: {
                                $cond: {
                                    if: { $gte: ["$totalMarks", 300] },
                                    then: "Pass",
                                    else: "Fail"
                                }
                            },
                            city: "$$REMOVE"
                        }
                    }
                ]).toArray();
        
                let totalSalary = await collection.aggregate([
                    {
                        $match: {
                            salary: { $exists: true },
                            bonus: { $exists: true }
                        }
                    },
                    {
                        $addFields: {
                            totalSalary: { $sum: ["$salary", "$bonus"] }
                        }
                    }
                ]).toArray();
        
        
                //$out mean create a collection that return am aggregate 
                //Note use in last always 
        
                let revenue = await order.aggregate([
                    {
                        $match: {
                            price: { $exists: true },
                            quantity: { $exists: true }
                        }
                    },
                    {
                        $group: {
                            _id: "$category",
                            totalRevenue: {
                                $sum: { $multiply: ["$price", "$quantity"] }
                            }
                        }
                    },
                    {
                        $out: "report"
                    }
                ]).toArray();
        
                //find delivered total based on category
                await order.aggregate([
                    {
                        $match: {
                            status: "Delivered"
                        }
                    },
                    {
                        $group: {
                            _id: "$category",
                            totalRevenue: {
                                $sum: { $multiply: ["$price", "$quantity"] }
                            }
                        }
                    },
                    {
                        $out: "DeliveredReport"
                    }
                ]).toArray();
        
        
                //$merge operator
                await order.aggregate([
                    {
                        $group: {
                            _id: "$category",
                            totalRevenue: {
                                $sum: { $multiply: ["$price", "$quantity"] }
                            }
                        }
                    },
                    {
                        $addFields: {
                            status: true
                        }
                    },
                    {
                        $out: "newReport"
                    }
                ]).toArray();
                //merge only update
                await db.collection("newReport").aggregate([
                    {
                        $merge: {
                            into: "report"
                        }
                    }
                ]).toArray();
        
                //advance 
                await db.collection("DeliveredReport").aggregate([
                    {
                        $merge: {
                            into: "report",
                            on: "_id",
                            whenMatched: "merge",
                            whenNotMatched: "insert"
                        }
                    }
                ]).toArray();*
        
                //$unionWith simple mean two collection show with one collection aggregate , with pipeline
        
                let res = await db.collection("report").aggregate([
                    {
                        $unionWith: {
                            coll: "DeliveredReport",
                            pipeline: [
                                {
                                    $addFields:{
                                        deliveredItems: true
                                    }
                                }
                            ]
                        }
                    }
                ]).toArray();
        
                console.log(res)
        
                // console.log(revenue);
               // console.log(await db.collection("report").find().toArray());
                //console.log(await db.collection("DeliveredReport").find().toArray());
                // console.log(await db.collection("newReport").find().toArray())
                */

        //$facet
        /*
              let findSingle = await collection.aggregate([
                {
                    $facet: {
                        cityBySeperate: [
                            {
                                $group: {
                                    _id: "$city",
                                    profile: {
                                        $push: "$$ROOT"
                                    }
                                }
                            }
                        ],
                        totalDocs: [{
                            $count: "totalDocs"
                        }]
                    }
                }
              ]).toArray();

        let deliveredRevenue = await order.aggregate([
            {
                $facet: {
                    totalRevenue: [
                        {
                            $match: { status: "Delivered" }
                        },
                        {
                            $group: {
                                _id: "$category",
                                totalRevenue: {
                                    $sum:  { $multiply: ["$price", "$quantity"] }
                                },
                                count: {
                                    $sum: 1
                                }
                            }
                        }
                    ],
                    totalSale: [
                        {
                            $match: { status: "Delivered" }
                        },
                        {
                            $group: {
                                _id: null,
                                totalSaling: {
                                    $sum:  { $multiply: ["$price", "$quantity"] }
                                },
                                totalDocs: {
                                    $sum: 1
                                }
                            }
                        }
                    ]
                }
            }
        ]).toArray();

        //console.dir(findSingle,{depth: null})
        console.dir(deliveredRevenue, { depth: null });
        // console.log(await collection.find().toArray());
        //console.log(await order.find().toArray())
*/

        //$facet as same as fill method in arr but value, locf, and linear provide
        
           /*   let putVal = await sales.aggregate([
                {
                    $fill: {
                       output:{
                         sales: {value: 10}
                       }
                    }
                }
              ]).toArray();
        
             let putMiddleVal = await sales.aggregate([
                {
                    $fill:{
                        partitionBy: "$product",
                        sortBy: {_id: 1},
                        output:{
                            sales: {method: "locf"}
                        }
                    }
                }
              ]).toArray();*/

        let putLinear = await sales.aggregate([
            {
                $fill: {
                    sortBy: { _id: 1 },
                    output: {
                        sales: {
                            method: "linear"
                        }
                    }
                }
            }
        ]).toArray();

        //add custom value
      //   console.log(putVal);
      //console.log(putMiddleVal);
       console.log(putLinear);

         //console.log(await sales.find().toArray())
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
}

run()
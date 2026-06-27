import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("CodProDB");
        let collection = db.collection("confition");

        /*
            //data
            await collection.insertMany(
                  [
                {
                    "name": "Aman",
                    "age": 20,
                    "marks": 85,
                    "salary": 50000,
                    "city": "Ranchi"
                },
                {
                    "name": "Ravi",
                    "age": 22,
                    "marks": 45,
                    "salary": 30000,
                    "city": "Delhi"
                },
                {
                    "name": "Sita",
                    "age": 19,
                    "marks": 72,
                    "salary": null,
                    "city": "Mumbai"
                },
                {
                    "name": "Priya",
                    "age": 25,
                    "marks": 95,
                    "salary": 80000,
                    "city": null
                },
                {
                    "name": "Karan",
                    "age": 21,
                    "marks": 35,
                    "salary": 25000
                },
                {
                    "name": "Neha",
                    "age": 23,
                    "marks": 60,
                    "salary": 45000,
                    "city": "Kolkata"
                }
            ]
            );
            */

        //$cond

        let r1 = await collection.aggregate([
            {
                $project: {
                    name: 1,
                    result: {
                        $cond: {
                            if: { $gte: ["$marks", 50] },
                            then: "Pass",
                            else: "Fail"
                        }
                    },
                    salarySatus: {
                        $cond: {
                            if: { $gte: ["$salary", 50000] },
                            then: "High",
                            else: "Low"
                        }
                    },
                    adult: {
                        $cond: {
                            if: { $gte: ["$age", 18] },
                            then: "Yes",
                            else: "No"
                        }
                    }
                }
            }
        ]).toArray();
        //$ifNull
        let r2 = await collection.aggregate([
            {
                $project: {
                    name: 1,
                    salary: {
                        $ifNull: ["$salary", 0]
                    },
                    city: {
                        $ifNull: ["$city", "Unknown"]
                    },
                    salaryWithDefault: {
                        $ifNull: ["$salary", 1000]
                    }
                }
            }
        ]).toArray();

        //$switch
        let r3 = await collection.aggregate(
            [
                {
                    $project: {
                        name: 1,
                        salary: 1,
                        marks: 1,
                        age: 1,
                        grade: {
                            $switch: {
                                branches: [
                                    { case: { $gte: ["$marks", 80] }, then: "A" },
                                    { case: { $gte: ["$marks", 60] }, then: "B" },
                                    { case: { $gte: ["$marks", 40] }, then: "C" }
                                ],
                                default: "F"
                            }
                        },
                        experienceLevel: {
                            $switch: {
                                branches: [
                                    { case: { $gte: ["$age", 25] }, then: "Senior" },
                                    { case: { $gte: ["$age", 22] }, then: "Mid" },
                                    { case: { $gte: ["$age", 18] }, then: "Junior" }
                                ],
                                default: "Child"
                            }
                        },
                        salaryCategory: {
                            $switch: {
                                branches: [
                                    { case: { $gte: ["$salary", 70000] }, then: "Excellent" },
                                    { case: { $gte: ["$salary", 50000] }, then: "Good" },
                                    { case: { $gte: ["$salary", 30000] }, then: "Average" }
                                ],
                                default: "Poor"
                            }
                        }
                    }
                }
            ]
        ).toArray();


        //challenge 
        let r4 = await collection.aggregate([
            {
                $project: {
                    salary: {
                        $ifNull: ["$salary", 0]
                    },
                    status: {
                        $cond: {
                            if: { $gte: ["$marks", 33] },
                            then: "Pass",
                            else: "Fail"
                        }
                    },
                    grade: {
                        $switch: {
                            branches: [
                                { case: { $gte: ["$marks", 80] }, then: "A" },
                                { case: { $gte: ["$marks", 60] }, then: "B" },
                                { case: { $gte: ["$marks", 40] }, then: "C" }
                            ],
                            default: "F"
                        }
                    }
                }
            }
        ]).toArray();

        console.log(r4)


        //   console.log(await collection.find().toArray())


    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }
}

run()
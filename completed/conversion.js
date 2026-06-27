import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("CodProDB");
        let collection = db.collection("typed");


        //add data
        /*
                await collection.insertMany([
                    {
                        "name": "Aman",
                        "age": "20",
                        "salary": "50000",
                        "active": "true",
                        "rating": "4.5",
                        "amount": "123.45"
                    },
                    {
                        "name": "Ravi",
                        "age": "25",
                        "salary": "60000",
                        "active": "false",
                        "rating": "3.8",
                        "amount": "456.78"
                    },
                    {
                        "name": "Sita",
                        "age": "30",
                        "salary": "70000",
                        "active": "1",
                        "rating": "4.2",
                        "amount": "789.12"
                    },
                    {
                        "name": "John",
                        "age": "18",
                        "salary": "45000",
                        "active": "0",
                        "rating": "2.9",
                        "amount": "99.99"
                    },
                    {
                        "name": "Neha",
                        "age": "22",
                        "salary": "55000",
                        "active": "TRUE",
                        "rating": "4.7",
                        "amount": "1000.01"
                    }
                ]);
        
                //$toString
                */
        let r1 = await collection.aggregate([
            {
                $project: {
                    stringAge: {
                        $toString: 20
                    },
                    intSalary32bit: {
                        $toInt: "$salary"
                    },
                    intAge32bit: {
                        $toInt: "$age"
                    },
                    longInt64bit: {
                        $toLong: "8676589054"
                    },
                    toDouble: {
                        $toDouble: "$rating"
                    },
                    doubleLoosPresion: {
                        $toDouble: {
                            $add: [0.2, 0.1]
                        }
                    },
                    persistPresion128bit: {
                        $toDecimal: {
                            $add: [0.2, 0.1]
                        }
                    },
                    amountPresion: {
                        $toDecimal: "$amount"
                    },
                    toBoolean: {
                        $toBool: "$active"
                    },
                    cntBool: {
                        $toBool: 1
                    },
                    cntDateObj: {
                        $toDate: "2015-8-18"
                    },
                    cntObjectId: {
                        $toObjectId: "ae54f85468d64a646fe6a5c8"
                    },
                    cntIntoInt: {
                        $convert: {
                            input: "120",
                            to: "int",
                            onError: -1,
                            onNull: 0
                        }
                    },
                    cntBool: {
                        $convert: {
                            input: 1,
                            to: "bool",
                            onError: -1,
                            onNull: 0
                        }
                    },
                    dataTypeAge: {
                        $type: "$age"
                    },
                    dataTypeNumber: {
                        $type: 576
                    },
                    salaryIsNumber: {
                        $isNumber: "$salary"
                    },
                    isN: {
                        $isNumber: 4554
                    }
                }
            }
        ]).toArray()





        console.log(r1)
        // console.log(await collection.find().toArray())
    } catch (err) {
        console.log(err)
    } finally {
        await client.close();
    }
}

run()

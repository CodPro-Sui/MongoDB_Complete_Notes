import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("CodProDB");
        let collection = db.collection("array");

        await collection.insertMany([
            {
                name: "Naushad",
                marks: [85, 92, 78, 95, 88],
                skills: ["c++", "mongodb", "JavaScript"],
                prices: [1000, 3200, 3000]
            },
            {
                name: "John",
                marks: [68, 82, 38, 30, 58],
                skills: ["HTML", "CSS", "JavaScript"],
                prices: [700, 20, 30]
            },
            {
                name: "CodPro",
                marks: [89, 92, 89, 65, 88],
                skills: ["java", "kotlin", "python"],
                prices: [300, 208, 789]
            }
        ]);

        //$arrayElemAt : return index based elemen
        //$firstN : return from first n number elements

        let r1 = await collection.aggregate([
            {
                $project: {
                    marks: 1,
                    twoNumber: {
                        $arrayElemAt: ["$marks", 1]
                    },
                    firstThree: {
                        $firstN: {
                            input: "$marks",
                            n: 3
                        }
                    },
                    lastTwo: {
                        $lastN: {
                            input: "$marks",
                            n: 2
                        }
                    },
                    maxTwo: {
                        $maxN: {
                            input: "$marks",
                            n: 2
                        }
                    },
                    minOne: {
                        $minN: {
                            input: "$marks",
                            n: 1
                        }
                    }
                }
            }
        ]).toArray();


        //$slice : reurn slice 🍕 of specified range
        //syntax $slice: ["arr",n] if n p+ first number slice, negative opposite 
        // slice $slice : ["arr",s,l] s = skip n,l = limit
        let r2 = await collection.aggregate([
            {
                $project: {
                    marks: 1,
                    getFirstN: {
                        $slice: ["$marks", 2]
                    },
                    getLastN: {
                        $slice: ["$marks", -2]
                    },
                    getSpeficRange: {
                        $slice: ["$marks", 3, 2]
                    }
                }
            }
        ]).toArray();


        //$sortArray: return sort form
        // sortBy: 1 mean ascending order, -1 descending order 

        let r3 = await collection.aggregate([
            {
                $project: {
                    marks: 1,
                    prices: 1,
                    name: 1,
                    accendingMatks: {
                        $sortArray: {
                            input: "$marks",
                            sortBy: 1
                        }
                    },
                    descendingPrice: {
                        $sortArray: {
                            input: "$prices",
                            sortBy: -1
                        }
                    },
                    sortName: {
                        $reduce: {
                            input: {
                                $sortArray: {
                                    input: { $split: ["$name", " "] },
                                    sortBy: 1
                                }
                            },
                            initialValue: "",
                            in: { $concat: ["$$value", "$$this"] }
                        }
                    },
                    reverseMarks: {
                        $reverseArray: "$marks"
                    },
                    reversePrices: {
                        $reverseArray: "$prices"
                    }
                }
            }
        ]).toArray();

        // $size return length of arr

        let r4 = await collection.aggregate([
            {
                $project: {
                    marks: 1,
                    prices: 1,
                    skills: 1,
                    lengthOfMarks: {
                        $size: "$marks"
                    },
                    lengthOfPrice: {
                        $size: "$prices",
                    },
                    hasCSS: {
                        $in: ["CSS", "$skills"]
                    },
                    hasCPlus: {
                        $in: ["c++", "$skills"]
                    },
                    indexOfCplus: {
                        $indexOfArray: ["$skills", "java"]
                    },
                    indexOdMongoDB: {
                        $indexOfArray: ["$skills", "mongodb"]
                    },
                    isArray: {
                        $isArray: "$skills"
                    },
                    isArrayName: {
                        $isArray: "$name"
                    }
                }
            }
        ]).toArray();


        let r5 = await collection.aggregate([
            {
                $project: {
                    marks: 1,
                    mapDivideByTen: {
                        $map: {
                            input: "$marks",
                            as: "n",
                            in: {
                                $divide: ["$$n", 10]
                            }
                        }
                    },
                    printOneToTen: {
                        $map: {
                            input: { $range: [1, 11] },
                            as: "n",
                            in: {
                                $divide: ["$$n", 1]
                            }
                        }
                    },
                    simpleLoop: {
                        $range: [0, 10]
                    },
                    findGreaterThanfifty: {
                        $filter: {
                            input: "$marks",
                            as: "n",
                            cond: {
                                $gt: ["$$n", 50]
                            }
                        }
                    },
                    hascplus: {
                        $filter: {
                            input: "$skills",
                            as: "skill",
                            cond: {
                                $in: ["JavaScript", "$skills"]
                            }
                        }
                    },
                    totalMarks: {
                        $reduce: {
                            input: "$marks",
                            initialValue: 0,
                            in: {
                                $sum: ["$$value", "$$this"]
                            }
                        }
                    },
                    totalOneToSix: {
                        $reduce: {
                            input: { $range: [1, 7] },
                            initialValue: 0,
                            in: {
                                $sum: ["$$value", "$$this"]
                            }
                        }
                    }
                }
            }
        ]).toArray();

        let r6 = await collection.aggregate([
            {
                $project: {
                    joinTwoSkills: {
                        $concatArrays: ["$skills", ["my own language", "c#"]]
                    },
                    joinArray: {
                        $concatArrays: [[1, 2, 3], [4, 5, 6]]
                    },
                    joinArrayWithZip: {
                        $zip: { inputs: ["$skills", "$prices"] }
                    },
                    joinArray: {
                        $zip: { inputs: ["$skills", ["$name"]] }
                    },
                    getObjForm: {
                        $arrayToObject: [
                            [
                                { k: "age", v: 20 },
                                { k: "devloper", v: "codPro Sui" }
                            ]
                        ]
                    },
                    getArr: {
                        $objectToArray: {
                            name: "codPro Sui",
                            role: "developer"
                        }
                    }
                }
            }
        ]).toArray();

        //console.log(r6)
        console.dir(r6, { depth: null })
        //console.log(await collection.find({}).toArray())



    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }

}
run()
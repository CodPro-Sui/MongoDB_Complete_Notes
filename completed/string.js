import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { isCookie } from "react-router-dom";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("CodProDB");
        let collection = db.collection("string");
        /*
        await collection.insertMany([
        {
          _id: 1,
          firstName: "John",
          lastName: "Doe",
          fullName: "John Doe",
          email: "john.doe@gmail.com",
          city: "New York",
          bio: "   MongoDB Developer   ",
          age: 25,
          salary: 45000,
          joinDate: "2024-01-15",
          skills: "MongoDB,NodeJS,React"
        },
        {
          _id: 2,
          firstName: "ALICE",
          lastName: "SMITH",
          fullName: "ALICE SMITH",
          email: "alice.smith@yahoo.com",
          city: "LONDON",
          bio: "   Full Stack Engineer   ",
          age: 28,
          salary: 55000,
          joinDate: "2023-05-20",
          skills: "JavaScript,React,NextJS"
        },
        {
          _id: 3,
          firstName: "Rahul",
          lastName: "Sharma",
          fullName: "Rahul Sharma",
          email: "rahul123@gmail.com",
          city: "Delhi",
          bio: "   MERN Stack Developer   ",
          age: 22,
          salary: 35000,
          joinDate: "2025-03-10",
          skills: "MongoDB,Express,React"
        },
        {
          _id: 4,
          firstName: "Priya",
          lastName: "Patel",
          fullName: "Priya Patel",
          email: "priya.patel@outlook.com",
          city: "Mumbai",
          bio: "   Data Analyst   ",
          age: 30,
          salary: 65000,
          joinDate: "2022-11-01",
          skills: "Python,SQL,PowerBI"
        },
        {
          _id: 5,
          firstName: "Michael",
          lastName: "Brown",
          fullName: "Michael Brown",
          email: "michael.brown@test.com",
          city: "Chicago",
          bio: "   Backend Developer   ",
          age: 27,
          salary: 50000,
          joinDate: "2021-07-12",
          skills: "NodeJS,MongoDB,Docker"
        }
        ])*/

        //$toString
        let r1 = await collection.aggregate([
            {
                $project: {
                    convertToStringAge: { $toString: "$age" },
                    convertToStringSalary: { $toString: "$salary" }
                }
            }
        ]).toArray();
        //toUpper
        let r2 = await collection.aggregate([
            {
                $project: {
                    upperFirstName: { $toUpper: "$firstName" },
                    upperLastName: { $toUpper: "$lastName" }
                }
            }
        ]).toArray();

        //toLower
        let r3 = await collection.aggregate([
            {
                $project: {
                    lowerFirstName: { $toLower: "$firstName" },
                    lowerLastName: { $toLower: "$lastName" }
                }
            }
        ]).toArray();

        //strLenBytes
        let r4 = await collection.aggregate([
            {
                $project: {
                    totalFullNameLength: { $strLenBytes: "$fullName" }
                }
            }
        ]).toArray();

        //strLenCP
        let r5 = await collection.aggregate([
            {
                $project: {
                    totalFullNameLengthCP: { $strLenCP: "$fullName" }
                }
            }
        ]).toArray();

        //strcasecmp
        let r6 = await collection.aggregate([
            {
                $project: {
                    fullName: 1,
                    caseCompare: { $strcasecmp: ["$fullName", "priya Patel"] }
                }
            }
        ]).toArray();

        //substrBytes
        let r7 = await collection.aggregate([
            {
                $project: {
                    fullName: 1,
                    slice: { $substrBytes: ["$fullName", 0, 5] }
                }
            }
        ]).toArray();

        //subStrCP
        let r8 = await collection.aggregate([
            {
                $project: {
                    fullName: 1,
                    slice: { $substrCP: ["$fullName", 2, 5] }
                }
            }
        ]).toArray();

        //replaceOne
        let r9 = await collection.aggregate([
            {
                $project: {
                    replace: {
                        $replaceOne: {
                            input: "I love JS",
                            find: "JS",
                            replacement: "c++"
                        }
                    }
                }
            }
        ]).toArray();


        //replaceAll
        let r10 = await collection.aggregate([
            {
                $project: {
                    replace: {
                        $replaceAll: {
                            input: "I love JS and code in JS ",
                            find: "JS",
                            replacement: "c++"
                        }
                    }
                }
            }
        ]).toArray();

        //concat
        let r11 = await collection.aggregate([
            {
                $project: {
                    fullName: 1,
                    fullNameAgain: { $concat: ["$firstName", " ", "$lastName"] }
                }
            }
        ]).toArray();

        //split
        let r12 = await collection.aggregate([
            {
                $project: {
                    skills: 1,
                    skillFormat: { $split: ["$skills", ","] }
                }
            }
        ]).toArray();

        //ltrim
        let r13 = await collection.aggregate([
            {
                $project: {
                    bio: 1,
                    lTrim: {
                        $ltrim: {
                            input: "$bio"
                        }
                    }
                }
            }
        ]).toArray();

        //rtrim
        let r14 = await collection.aggregate([
            {
                $project: {
                    bio: 1,
                    rTrim: {
                        $rtrim: {
                            input: "$bio"
                        }
                    }
                }
            }
        ]).toArray();

        //trim
        let r15 = await collection.aggregate([
            {
                $project: {
                    bio: 1,
                    Trim: {
                        $trim: {
                            input: "$bio"
                        }
                    }
                }
            }
        ]).toArray();

        //dayeFromString
        //trim
        let r16 = await collection.aggregate([
            {
                $project: {
                    correctDate: {
                        $dateFromString: {
                            dateString: "$joinDate"
                        }
                    }
                }
            }
        ]).toArray();

        //dateToString
        let r17 = await collection.aggregate([
            {
                $project: {
                    customDateFISO: {
                        $dateToString: {
                            format: "%d-%m-%Y",
                            date: new Date("2022-01-15")
                        }
                    }
                }
            }
        ]).toArray();

        //indexOfBytes
        let r18 = await collection.aggregate([
            {
                $project: {
                    fullName: 1,
                    startThis: {
                        $indexOfBytes: ["$fullName", "a"]
                    }
                }
            }
        ]).toArray();

        //indexOfCP
        let r19 = await collection.aggregate([
            {
                $project: {
                    fullName: 1,
                    startThis: {
                        $indexOfCP: ["$fullName", "ae"]
                    }
                }
            }
        ]).toArray();


        //$regexMatch
        let r20 = await collection.aggregate([
            {
                $project: {
                    email: 1,
                    isInclude: {
                        $regexMatch: {
                            input: "$email",
                            regex: "@gmail"
                        }
                    }
                }
            }
        ]).toArray();


        //regexFind
        let r21 = await collection.aggregate([
            {
                $project: {
                    extractPhoneNumber: {
                        $regexFind: {
                            input: "my number is 655 9334950617",
                            regex: /\d+/
                        }
                    }
                }
            }
        ]).toArray();

        //regexFindAll
        let r22 = await collection.aggregate([
            {
                $project: {
                    extractPhoneNumberAll: {
                        $regexFindAll: {
                            input: "my number is 655 9334950617",
                            regex: /\d/
                        }
                    }
                }
            }
        ]).toArray();

        //another ex
        //regexFindAll
        let r23 = await collection.aggregate([
            {
                $project: {
                    extractAllChars: {
                        $regexFindAll: {
                            input: "my number is 655 9334950617",
                            regex: /[a-zA-Z]+/g
                        }
                    }
                }
            }
        ]).toArray();

        console.dir(r23, { depth: null })

    } catch (err) {
        console.log(err)
    } finally {
        await client.close();
    }

}
run()

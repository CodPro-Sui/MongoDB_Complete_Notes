import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("CodProDB");
        let collection = db.collection("date");

        await collection.insertMany([
            {
                "name": "CodPro",
                "createdAt": new Date("2005-04-15T20:25:10.120Z")
            },
            {
                "name": "Naushad",
                "createdAt": new Date("2010-02-20T14:45:45.13Z")
            },
            {
                "name": "John",
                "createdAt": new Date("2019-07-10T10:15:45.120Z")
            }
        ]);




        //$hour,minute,second and millisecond
        let r1 = await collection.aggregate([
            {
                $project: {
                    hour: {
                        $hour: "$createdAt"
                    },
                    minute: {
                        $minute: "$createdAt"
                    },
                    second: {
                        $second: "$createdAt"
                    },
                    milliSecond: {
                        $millisecond: "$createdAt"
                    }
                }
            }
        ]).toArray();

        // $month get month
        // $year get year
        // $week get week from jan 1 to curr ,utc sunday,other timezon monday
        //dayOfMonth return exact date of curr month
        //dayOfWeek return exact day from a current week (0-7)
        //dayOfYear return days from jan 1 to curr as days(0 - 365)

        let r2 = await collection.aggregate([
            {
                $project: {
                    createdAt: 1,
                    month: {
                        $month: "$createdAt"
                    },
                    year: {
                        $year: "$createdAt"
                    },
                    week: {
                        $week: "$createdAt"
                    },
                    dayOfMonth: {
                        $dayOfMonth: "$createdAt"
                    },
                    dayOfWeek: {
                        $dayOfWeek: "$createdAt"
                    },
                    dayOfYear: {
                        $dayOfYear: "$createdAt"
                    }
                }
            }
        ]).toArray();

        //dateAdd,dateSubtract,dateDiff
        //unit day,month,year,week,hour,minute,second,mill.
        let r3 = await collection.aggregate([
            {
                $project: {
                    createdAt: 1,
                    forwardDate: {
                        $dateAdd: {
                            startDate: "$createdAt",
                            unit: "day",
                            amount: 5
                        }
                    },
                    backwardDate: {
                        $dateSubtract: {
                            startDate: "$createdAt",
                            unit: "year",
                            amount: 2
                        }
                    },
                    dateDiff: {
                        $dateDiff: {
                            startDate: "$createdAt",
                            endDate: new Date("2030-07-10T15:45:20.120Z"),
                            unit: "year"
                        }
                    }
                }
            }
        ]).toArray();

        //trunc behavior, in unit trunc month then day become 1, year become m 1 day 1
        //dateFromParts - create date obj from parts
        // dateToParts - split date obj from date Obj
        let r4 = await collection.aggregate([
            {
                $project: {
                    createDate: {
                        $dateFromParts: {
                            year: 2022,
                            month: 10,
                            day: 20,
                            hour: 10,
                            minute: 30,
                            second: 15,
                            millisecond: 160
                        }
                    },
                    createDateObject: {
                        $dateToParts: {
                            date: "$createdAt"
                        }
                    },
                    round: {
                        $dateTrunc: {
                            date: "$createdAt",
                            unit: "month"
                        }
                    }
                }
            }
        ]).toArray();

        // dateFromString return date obj, accept a date string
        //dateToString return specified format
        //toDate similer as dateFromString
        let r5 = await collection.aggregate([
            {
                $project: {
                    createDateFromString: {
                        $dateFromString: {
                            dateString: "2003-06-04"
                        }
                    },
                    createSpecificDateFormate: {
                        $dateToString: {
                            format: "%d/%m/%Y",
                            date: "$createdAt"
                        }
                    },
                    createDateObj: {
                        $toDate: "2022-12-10"
                    }
                }
            }
        ]).toArray();

        //isoDayOfWeek

        let r6 = await collection.aggregate([
            {
                $project: {
                    createdAt: 1,
                    isoDate: {
                        $isoDayOfWeek: "$createdAt"
                    },
                    weekN: {
                        $isoWeek: "$createdAt"
                    },
                    isoWeekYear: {
                        $isoWeekYear: "$createdAt"
                    }
                }
            }
        ]).toArray()

        console.log(r6)
        //console.log(await collection.find().toArray())

    } catch (err) {
        console.log(err)
    } finally {
        await client.close();
    }

}
run();
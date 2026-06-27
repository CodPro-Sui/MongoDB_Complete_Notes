import { MongoClient, Int32 } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {

    await client.connect();

    console.log("Connected (*_*)");

    const validation = client.db("validator");

    /*
    //create collection with validator 
    await validation.createCollection("valid",{
        validator: {
            $jsonSchema: {
                bsonType: "object",
                additionalProperties: false,

                required: ["name", "email", "age", "skills", "password", "gender", "address"],
                title: "User validtion Object",

                properties: {
                    _id:{
                        bsonType: "objectId"
                    },
                    name: {
                        bsonType: "string",
                        minLength: 3,
                        maxLength: 20,
                        title: "name should be string & required"
                    },
                    email: {
                        bsonType: "string",
                        pattern: "^.+@.+$",
                        title: "email should be valid & required"
                    },
                    age: {
                        bsonType: "int",
                        minimum: 18,
                        maximum: 60,
                        title: "age should be between 18 to 60"
                    },
                    skills: {
                        bsonType: "array",
                        items: {
                            bsonType: "string"
                        },
                        minItems: 1,
                        maxItems: 5,
                        uniqueItems: true,
                        title: "required"
                    },
                    password: {
                        bsonType: "string",
                        minLength: 8,
                        title: "required"
                    },
                    gender: {
                        bsonType: "string",
                        enum: ["male", "female", "others"],
                        title: "required, select male, female or others category"
                    },
                    address: {
                        bsonType: "object",
                        additionalProperties: false,
                        required: ["city"],
                        properties: {
                            city: {
                                bsonType: "string",
                                title: "city should be a string format"
                            }
                        }
                    }
                }
            }
        },

        validationLevel: "strict",
        validationAction: "error"
    });*/


    //command instead of runCommand
    //if already exist database and collect and you want apply validtoin now , start command method

    await client.db("myApp").command({
        collMod:"students",
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required : ["name","skills"],
                properties: {
                    name: {
                        bsonType: "string",
                        title: "name should be string and required",
                        minLength: 3
                    },
                    skills: {
                        bsonType: "array",
                        items: {
                            bsonType: "string",
                        },
                        maxItems: 10,
                        minItems: 2
                    }
                }
            }
        },
        validationLevel: "strict",
        validationAction: "error"
    })

    let collection = client.db("myApp").collection("students");

    try {
        await collection.insertOne({
            name: "CodPro",
            email: "suicodpro@gmail.com",
            age: new Int32(20),
            skills: ["MongoDB", "JS"],
            password: "hashedMyPassword@564",
            gender: "male",
            address: {
                city: "Giridih"
            }
        })
    } catch (error) {
        console.dir(error.errInfo,{depth:null})
    }
    console.log(await collection.find({"address.city": "Giridih"}).toArray());
};

run();
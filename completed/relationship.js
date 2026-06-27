import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
//performance && indexing 

dotenv.config()

const client = new MongoClient(process.env.MONGO_URL);

const run = async () => {
    await client.connect();
    console.log("connected!");
    //db create
    const usersDB = client.db("usersDB");
    //create collections
    const profile = usersDB.collection("profile");
    const product = usersDB.collection("products");
    const orders = usersDB.collection("orders");

    //embedded reference
    const embedProfile = usersDB.collection("embedProfile");

    try {
        //embedded reference 
        await embedProfile.insertOne({
            name: "CodPro",
            email: "suicodpro@gmail.com",
            age: 21,
            orders: [
                {
                    id: 1,
                    product: "laptop",
                    price: 50000,
                },
                {
                    id: 2,
                    product: "eyeglass",
                    price: 1800,
                }
            ]
        });

        //references by id

        //inser data first of products
        await product.insertMany([
            {
                productName: "Leptop",
                price: 60000
            },
            {
                productName: "Phone",
                price: 12000
            }
        ]);

        //profile 
        await profile.insertMany([
            {
                name: "CodPro Sui",
                email: "suicodpro@gmail.com",
                age: 18
            },
            {
                name: "Naushad Ansari",
                email: "naushadansarics@gmail.com",
                age: 20
            }
        ])


        //Orders 
        //connects relationship references by using id
        await orders.insertMany([
            {
                userId: new ObjectId('6a0810d61e9f0642835a4f34'),
                userOrders: [
                    {
                        productId: new ObjectId('6a080f54e9705872614f5e5d'),
                        profuctName: "Laptop",
                        items: 1,
                        price: 60000
                    },
                    {
                        productId: new ObjectId('6a080f54e9705872614f5e5e'),
                        productName: "Phone",
                        items: 1,
                        price: 12000
                    }
                ]
            },
            {
                userId: new ObjectId('6a0810d61e9f0642835a4f35'),
                userOrders: [
                    {
                        productId: new ObjectId('6a080f54e9705872614f5e5e'),
                        productName: "Phone",
                        items: 1,
                        price: 12000
                    }
                ]
            }
        ])



        //advance aggregations in $lookup

        let result = await orders.aggregate([
            {
                $lookup: {
                    from: "profile",
                    localField: "userId",
                    foreignField: "_id",
                    as: "profile"
                }
            }
        ]).toArray();


        //   console.log("first");
        //  console.log(await product.find().toArray());
        // console.log("sec");
        //   console.log(await orders.find().toArray())


        console.log(result)
    } catch (error) {
        console.log(error)
    } finally {
        client.close()
    }
}

run();

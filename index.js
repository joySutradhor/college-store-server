const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// console.log(process.env.DB_PASS)

// MidleWare 

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.40yptof.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const database = client.db("starUniverse");
        const comicsCollection = database.collection("comicsCollections")
        const collegeCollection = database.collection("CollegeStore")
        const myCollegeCollection = database.collection("myCollege")



        app.get("/comics", async (req, res) => {
            const cursor = comicsCollection.find().limit(20);
            const comics = await cursor.toArray();
            res.send(comics);
        })
        app.get("/colleges", async (req, res) => {
            const cursor = collegeCollection.find().limit(3);
            const colleges = await cursor.toArray();
            res.send(colleges);
        })

        app.get("/myCollege", async (req, res) => {
            const cursor = myCollegeCollection.find();
            const colleges = await cursor.toArray();
            res.send(colleges);
        })
        app.get("/allColleges", async (req, res) => {
            const cursor = collegeCollection.find();
            const allColleges = await cursor.toArray();
            res.send(allColleges);
        })

   
        app.get("/colleges/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await collegeCollection.findOne(query);
        
            res.send(result)
        })


     
        app.post("/myCollegeData", async (req, res) => {
            const newComic = req.body;
            const result = await myCollegeCollection.insertOne(newComic);
            res.send(result)
        })

       





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(" successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.connect();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello pain!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
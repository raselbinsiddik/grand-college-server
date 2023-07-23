const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// 
//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fy2r3q4.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const collegeCollection = client.db('grandCollege').collection('colleges');

        app.get('/colleges', async (req, res) => {
            const search = req.query.search;
            console.log(search);

            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }

            let result;
            if (search) {
                const nameQuery = { name: { $regex: search, $options: 'i' } };
                result = await addToysCollection.find({ $and: [query, nameQuery] }).toArray();
            } else {
                result = await collegeCollection.find(query).toArray();
            }

            res.send(result);
        });

        app.get('/colleges/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await collegeCollection.findOne(query);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('colleges class start');
})

app.listen(port, () => {
    console.log('colleges class start');
})
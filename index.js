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



        const collegeCollection = client.db('grandCollege').collection('colleges');
        const galleryCollection = client.db('grandCollege').collection('gallery');
        const admissionCollection = client.db('grandCollege').collection('admission');
        const usersCollection = client.db('grandCollege').collection('users');
        

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
                result = await collegeCollection.find({ $and: [query, nameQuery] }).toArray();
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

        app.get('/gallery', async (req, res) => {
            const result = await galleryCollection.find().toArray();
            res.send(result);
        })
        
        app.post('/admission', async (req, res) => {
            const users = req.body;
            console.log(users);
            const result = await admissionCollection.insertOne(users);
            res.send(result);
        });

        app.get('/admission', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const result = await admissionCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const users = req.body;
            console.log(users);
            const result = await usersCollection.insertOne(users);
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });


app.get('/', (req, res) => {
    res.send('colleges class start');
})

app.listen(port, () => {
    console.log('colleges class start');
})
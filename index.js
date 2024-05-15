const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const corsOptions = {
    origin: [
      'http://localhost:5173'
    ]
  }

app.use(cors(corsOptions));
app.use(express.json());
require('dotenv').config();


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.k7dzav4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

        const foodCollection = client.db('foodsDB').collection('foods');
        const requestCollection = client.db('foodsDB').collection('requests');


        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await foodCollection.findOne(filter);
            res.send(result)
        });

        app.post('/foods', async (req, res) => {
            const foods = req.body;
            const result = await foodCollection.insertOne(foods);
            res.send(result);
        });


        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const food = req.body;
            const foodInfo = {
                $set: {
                    food_image: food.food_image,
                    food_name: food.food_name,
                    quantity: food.quantity,
                    location: food.location,
                    expired_date: food.expired_date,
                    notes: food.notes,
                    donar_name: food.donar_name,
                    donar_email: food.donar_email,
                    donar_image: food.donar_image,
                    status: food.status,
                }
            }
            const result = await foodCollection.updateOne(filter, foodInfo, options)
            res.send(result)
        })

        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            res.send(result)
        });


        // -------------------------- Request Database ----------------------------

        app.get('/requests', async(req, res) => {
            const cursor = requestCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });


        app.post('/requests', async(req, res) => {
            const requests = req.body;
            const result = await requestCollection.insertOne(requests);
            res.send(result)
        });



        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', async (req, res) => {
    res.send('FoodSphere Server is running');
});

app.listen(port, () => {
    console.log(`The FoodSphere server is running on ${port}`);
});
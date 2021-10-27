const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1nyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('geniuscar');
        const servicesCollection = database.collection('services');
        // get api 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const allservices = await cursor.toArray();
            res.send(allservices);
        })
        // update services 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })
        // get a single api data 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleService = await servicesCollection.findOne(query);
            res.json(singleService)
        })
        // post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })
        // update api 
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const serviceUpdate = {
                $set: {
                    name: updatedService.name,
                    description: updatedService.description,
                    price: updatedService.price,
                    img: updatedService.img
                }
            };
            const result = await servicesCollection.updateOne(filter, serviceUpdate, options);
            res.json(result)
        })
        // delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const serviceDelete = await servicesCollection.deleteOne(query);
            res.json(serviceDelete);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)














// default api check run server
app.get('/', (req, res) => {
    res.send('Running Node Servers')
});
app.listen(port, () => {
    console.log('genius car port', port)
})
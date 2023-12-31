const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors())
app.use(express.json())

// MongoDB Conected

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.vwvxcgj.mongodb.net/?retryWrites=true&w=majority`;

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

    const chocolateCollection = client.db('chocolateDB').collection('chocolates') ;

    app.get('/chocolates',async(req,res)=>{
        const cursor = chocolateCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/chocolates/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} ;
        const result = await chocolateCollection.findOne(query);
        res.send(result);
    })

    app.post('/chocolates',async(req,res)=>{
        const chocolate = req.body;
        // console.log(chocolate);
        const result = await chocolateCollection.insertOne(chocolate);
        res.send(result);
    })

    app.delete('/chocolates/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await chocolateCollection.deleteOne(query);
        res.send(result);
    })

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


app.get('/',(req,res)=>{
    res.send('This is My Chocolate Server')
})

app.listen(port,()=>{
    console.log(`Chocolate Server running on: ${port}`)
})
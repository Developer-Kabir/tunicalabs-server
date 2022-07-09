const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.hkeao.mongodb.net:27017,cluster0-shard-00-01.hkeao.mongodb.net:27017,cluster0-shard-00-02.hkeao.mongodb.net:27017/?ssl=true&replicaSet=atlas-7i6kd9-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const studentCollection = client.db('tunicalabs').collection('student');

        app.get('/students', async (req, res) => {
            const query = {};
            const cursor = studentCollection.find(query);
            const students = await cursor.toArray();
            res.send(students);
        });

       
        app.post('/student', async (req, res) => {
            const newItem = req.body;
            const result = await studentCollection.insertOne(newItem);
            res.send(result)
        });

        app.delete('/students/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const student = await studentCollection.deleteOne(query);
            res.send(student);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get ('/', (req,res) =>{
    res.send('Tunicalabs Media server running')
});

app.listen( port, ()=>{
    console.log(`Tunicalabs server listening from port , ${port}`)
})

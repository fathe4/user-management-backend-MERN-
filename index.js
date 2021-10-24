const express = require('express')
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// user: userManagement
// pass: userManagement123

const uri = "mongodb+srv://userManagement:userManagement123@cluster0.mnat7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect()

        const database = client.db('users_management')
        const usersCollection = database.collection('users')


        // SHOW ALL USERS API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray()
            res.send(users)
        })

        // POST API
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            console.log('hitting the post', user);
            res.json(result)

        })

        // UPDATE USERS
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const result = await usersCollection.findOne(query)
            res.json(result)
        })

        // PUT
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const user = req.body


            const filter = { _id: objectId(id) }
            const updateUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }

            const result = await usersCollection.updateOne(filter, updateUser)
            console.log('HItting the update bttn', result);
            res.json(result)

        })

        //  DELETE AN USER
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const result = await usersCollection.deleteOne(query)
            console.log('Deleting this id', result);
            res.json(result)
        })


    } finally {
        // await client.close()
    }

}

run().catch(console.dir())

app.get('/', (req, res) => {
    res.send('I am node express')
})

app.listen(port, () => {
    console.log('Listening from port: ', port);
})
const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

// ====Middleware=======
app.use(cors())
app.use(express.json())

// ======Port ========
const port = process.env.PORT || 5000

// =======MongoDB=====
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnn0u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
	try {
		client.connect();
		console.log('DB Connected');
		const todoCollection = client.db("todos").collection("todoitems");
		const completeCollection = client.db("todos").collection("todocompletes");

		//==============================//
		//		ToDo Controller			//
		//==============================//

		// ====Add ToDo======
		 app.post('/todo', async (req, res) => {
		 	const todo = req.body;
		 	const result = await todoCollection.insertOne(todo);
		 	res.send(result);
		 });

		 // ====Get ToDo======
		 app.get('/todos', async (req, res) => {
		 	const query = {};
		 	const cursor = todoCollection.find(query);
		 	const todos = await cursor.toArray();
		 	res.send(todos);
		 });

		// ====Update ToDo======
		app.patch('/todo/:id', async (req, res)=>{
			const id = req.params.id;
			const todo = req.body;
			const filter = {_id: ObjectId(id)};
			const options ={ upsert: true };
			const updateTodo = {
				$set: todo
			};
			const result = await todoCollection.updateOne(filter, updateTodo, options);
			res.send(result);
		});

		// ====Delete ToDo======
		app.delete('/todo/:id', async(req, res) => {
			const id = req.params.id;
		    const todoId = { _id: ObjectId(id) };
			const result = await todoCollection.deleteOne(todoId);
		    res.send(result);
		});
		
		//==============================//
		//	 Complete ToDo Controller   //
		//==============================//

		// ====Add Complete ToDo======
		 app.post('/complete', async (req, res) => {
		 	const complete = req.body;
		 	const result = await completeCollection.insertOne(complete);
		 	res.send(result);
		 });

		 // ====Get Complete ToDo======
		 app.get('/completes', async (req, res) => {
		 	const query = {};
		 	const cursor = completeCollection.find(query);
		 	const completes = await cursor.toArray();
		 	res.send(completes);
		 });

		// ====Delete Complete ToDo======
		app.delete('/complete/:id', async(req, res) => {
			const id = req.params.id;
			const filter = { _id: id }
			const result = await completeCollection.deleteOne(filter);
		    res.send(result);
		});
		
	} catch (error) {
		console.log(error);
	} finally {

	}
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Server is Running')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

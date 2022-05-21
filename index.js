const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/hello', async(req, res)=>{
    res.send("Hello from Warehouse")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.0pflv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




app.listen(port, () => {
    console.log("Listening from", port);
  });
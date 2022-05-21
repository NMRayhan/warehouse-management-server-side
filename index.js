const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.0pflv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("bicycleDB").collection("bicycles");

    // get product in home page
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //add product by Admin
    app.post("/addProduct", async (req, res) => {
        const data = req.body;
        const result = await productCollection.insertOne(data);
        res.send(result);
      });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/hello", async (req, res) => {
  res.send("Hello from Warehouse");
});

app.listen(port, () => {
  console.log("Listening from", port);
});

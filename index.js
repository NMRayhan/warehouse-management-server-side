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
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.limit(6).toArray();
      res.send(result);
    });

    //add product by Admin
    app.post("/addProduct", async (req, res) => {
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.send(result);
    });

    //details product
    app.get("/product/details/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // delete product by Admin
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //update single Product
    app.put("/product/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          Admin_email: data.Admin_email,
          Product_Name: data.Product_Name,
          Product_Image_URL: data.Product_Image_URL,
          Short_Description: data.Short_Description,
          Price: data.Price,
          Quantity: data.Quantity,
          Supplier_Name: data.Supplier_Name,
        },
      };
      const result = await productCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // update single product Quantity by admin
    app.put("/product/quantity/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          Admin_email: data.Admin_email,
          Product_Name: data.Product_Name,
          Product_Image_URL: data.Product_Image_URL,
          Short_Description: data.Short_Description,
          Price: data.Price,
          Quantity: (data.Quantity = data.Quantity - 1),
          Supplier_Name: data.Supplier_Name,
        },
      };
      const result = await productCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // reStock single product Quantity by admin
    app.put("/product/quantity/reStock/:id/:quantity", async (req, res) => {
      const id = req.params.id;
      const newQuantity = req.params.quantity;
      const data = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          Admin_email: data.Admin_email,
          Product_Name: data.Product_Name,
          Product_Image_URL: data.Product_Image_URL,
          Short_Description: data.Short_Description,
          Price: data.Price,
          Quantity: newQuantity,
          Supplier_Name: data.Supplier_Name,
        },
      };
      const result = await productCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/myAdded/:email", async (req, res) => {
      const email = req.params.email;
      const query = { Admin_email: email };
      const cursor = productCollection.find(query)
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}


run().catch(console.dir);

app.listen(port, () => {
  console.log("Listening from", port);
});

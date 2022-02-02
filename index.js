const { request } = require("express");
const expess = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const res = require("express/lib/response");
const cors = require("cors");
const app = expess();



const PORT = 5000;
const MONGO_URL = process.env.URL;
app.use(expess.json());
app.use(cors);

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB connected !!!");
  return client;
}

app.get("/recpie", async (req, res) => {
  const data = req.query;
  const client = await createConnection();
  const filter = await client
    .db("Recpie")
    .collection("Data")
    .find(data)
    .toArray();
  res.send(filter).status(200);
});

app.get("/recpie/:id", async (req, res) => {
  const { id } = req.params;
  const client = await createConnection();
  const output = await client
    .db("Recpie")
    .collection("Data")
    .findOne({ id: id });
  const error = { error: "No data found" };
  output === undefined
    ? res.status(404).send(error)
    : res.status(200).send(output);
});

app.post("/recpie", async (req, res) => {
  const data = req.body;
  const client = await createConnection();
  const result = await client.db("Recpie").collection("Data").insertMany(data);
  res.send(result);
});

app.delete("/recpie/:id", async (req, res) => {
  const { id } = req.params;
  const client = await createConnection();
  const output = await client
    .db("Recpie")
    .collection("Data")
    .deleteOne({ id: id });
  const error = { error: "No data found" };
  output === undefined
    ? res.status(404).send(error)
    : res.status(200).send(output);
});

app.put("/recpie/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const client = await createConnection();
  const result = await client
    .db("Recpie")
    .collection("Data")
    .updateOne({ id: id }, { $set: data });
  res.send(result);
});

app.listen(PORT, () => {
  console.log("App is started on Port " + PORT);
});

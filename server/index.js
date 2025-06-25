const express = require("express");
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;

const authRoutes = require("./routes/authRoutes");

app.use(bodyParser.json());
app.use(authRoutes);

const mongoUri =
  "mongodb+srv://admin:Helloworld1244!@cimeratcluster.qu0aygm.mongodb.net/?retryWrites=true&w=majority&appName=CimeratCluster";

mongoose.connect(mongoUri, {});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.get("/", (req, res) => {
  res.send("Hello from Express!123444");
  res.status(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

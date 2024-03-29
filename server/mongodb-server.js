const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");

dotenv.config();
const app = express();

const corsOptions = {
  origin: ["http://localhost:8081", "http://localhost:3000"],
};

const PORT = process.env.PORT || 8080;

// Set CORS option
app.use(cors(corsOptions));

// Parse requests of content-type: application/json
app.use(bodyParser.json());

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// RESTful API route for DB
app.use("/", require("./app/mongodb/route/route.js"));
app.use("/api/user", require("./app/mongodb/route/userRouter.js"));

// DB Connection
const db = require("./app/mongodb/model/index.js");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log("db.url", db.url);
    // console.log("db.mongoose", db.mongoose);
    // console.log("db.tutorial.db", db.tutorial.db);
    console.log("Database Connection Success.");
  })
  .catch((err) => {
    console.log("Database Connection Failure.", err);
    process.exit();
  });

// Default route for server status
app.get("/", (req, res) => {
  res.json({ message: `Server is running on port ${PORT}` });
});

// Set listen port for request
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

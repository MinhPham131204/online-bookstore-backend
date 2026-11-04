const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();

const routes = require("./routes");

const port = 3000;

app.use(cookieParser())

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
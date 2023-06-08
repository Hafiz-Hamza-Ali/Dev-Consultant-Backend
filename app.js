const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const errorHandler = require("./api/middleware/errorHandler");
const colors = require("colors");
const { Server } = require("socket.io");
app.use(cors("*"));
const http = require("http");
//database connection
//const db = require("./api/models");
// const ChatRooms = db.ChatRooms;
// const AdminChats = db.AdminChats;
// parse requests of content-type - application/json
app.use(express.json());
const path = require("path");
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
// db.sequelize
//   .sync()
//   .then(() => {
//     console.log("Database Connected");
//   })
//   .catch((err) => {
//     console.log("failed to sync db: " + err.message);
//   });
app.get("/", (req, res) => {
  res.json({ message: "Dev App working fine!" });
}); // set port, listen for requests
require("./api/routes/Routes")(app);
app.use(errorHandler);
let port = process.env.PORT;
dotenv.config({
  path: "./config.env",
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
  },
});
const dbHost = process.env.PORT;
console.log(dbHost);
function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

// const socketUtils = require("./utils/socketUtils");

// const server = http.createServer(app);
// const io = socketUtils.sio(server);
// socketUtils.connection(io);

// const socketIOMiddleware = (req, res, next) => {
//   req.io = io;

//   next();
// };

// // ROUTES
// app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
//   req.io.emit("message", `Hello, ${req.originalUrl}`);
//   res.send("hello world!");
// });
// const port = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, "api/public")));
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// app.listen(port, () => {
//   console.log(
//     `Server is running in ${process.env.NODE_MODE} mode at port ${port}.`.bgCyan
//   );
// });

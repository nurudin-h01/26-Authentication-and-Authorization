const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
const accessTokenSecret = process.env.TOKEN_SECRET;

const users = [
  {
    username: "terra",
    password: "password123admin",
    role: "admin",
  },
  {
    username: "dave",
    password: "password123member",
    role: "member",
  },
];

const books = [
  {
    author: "Robert Martin",
    country: "USA",
    language: "English",
    pages: 209,
    title: "Clean Code",
    year: 2008,
  },
  {
    author: "Dave Thomas & Andy Hunt",
    country: "USA",
    language: "English",
    pages: 784,
    title: "The Pragmatic Programmer",
    year: 1999,
  },
  {
    author: "Kathy Sierra, Bert Bates",
    country: "USA",
    language: "English",
    pages: 928,
    title: "Head First Java",
    year: 2003,
  },
];

const authenticateJWT = (req, res, next) => {
  const authhead = req.headers.authorization;

  if (authhead) {
    const token = authhead.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};



app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (res) => res.username === username && res.password === password
  );
  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret
    );
    res.json({ accessToken });
  } else {
    res.send({ msg: "Username or password incorrect" });
  }
});



app.get("/books", authenticateJWT, (req, res) => {
  res.json(books);
});

app.post("/books", authenticateJWT, (req, res) => {
  const { role } = req.user;
  if (role !== "admin") {
    return res.sendStatus(403);
  }
  const newBook = req.body;
  books.push(newBook);
  res.send("Book added successfully");
});

app.listen(PORT, () => console.log("Server is listening on port", PORT));

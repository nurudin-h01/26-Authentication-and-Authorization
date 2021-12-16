const express = require("express");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const OneMinutes = 1000 * 60;
const app = express();
const port = 3000;
app.use("/login", express.static('views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use(sessions(
  {
    secret: "secretkeyregamxlvodhaskcy124sdns",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: OneMinutes,
      sameSite: true
    }
  }
))

const myusername = 'user1'
const mypassword = 'mypassword'

let session;

app.get("/", (req, res) => {
  session = req.session
  console.log(session);
  if(session.userID) {
    const html = `
      <h2>Hello ${session.userID}, Welcome</h2>
      <a href="/logout"><button>LOGOUT</button></a>
    `
    res.send(html)
  } else {
    res.redirect("/login")
  }
})

app.post("/user", (req, res) => {
  const { username, password } = req.body;
  session = req.session
  if(session.userID) {
    const html = `
      <h2>Already logged in</h2>
      <a href="/"><button>BACK TO HOME</button></a>
    `
    res.send(html)
  } else {
    if(username === myusername && password === mypassword) {
      session.userID = username
      console.log(req.session);
      res.redirect("/")
    } else {
      const html = `
        <H2>Invalid Username or Password</H2>
        <a href="/"><button>LOGIN</button></a>
      `
      res.status(401).send(html)
    }
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

app.listen(port, () => console.log("server is listening on port", port))
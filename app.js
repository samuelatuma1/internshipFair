const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

// Connect to local Database
mongoose.connect("mongodb://127.0.0.1:27017/internshipFairDB", {}, () => console.log(`Connected Successfully to Server at ${new Date()}`))

// set up
const app = express()
const session = require("express-session")
const cookieParser = require("cookie-parser")


// View Engine Set Up
app.set('view engine', 'ejs')

// Set up static directory
// app.use("/static", express.static('/static'))
app.use('/static', express.static('public'))

// session and cookie setup
app.use(session({
    secret : process.env.secret,
    resave : true,
    saveUninitialized : false,
    cookie : {
       // secure : true,
       maxAge : 200000000
    }
}))
app.use(cookieParser({
    secret : process.env.secret,
    options : {
        maxAge : 200000000
    }
}))

// Handling post data
app.use(express.urlencoded( { extended : true}))
app.use(express.json())

// Authentication
const {auth} = require("./controller/auth")
app.use("/auth", auth)


const port = process.env.PORT || 9000
app.listen(port , () => console.log(`Listening on PORT : ${port}`))




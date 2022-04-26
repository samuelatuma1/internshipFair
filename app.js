const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

// Connect to local Database
mongoose.connect("mongodb://127.0.0.1:27017/internshipFairDB", () => console.log(`Connected Successfully to Server at ${new Date()}`))

// set up
const app = express()
const session = require("express-session")
const cookieParser = require("cookie-parser")


// View Engine Set Up
app.set('view-engine', 'ejs')

// Set up static directory
app.use("/static", express.static(__dirname + '/static'))

// session and cookie setup
app.use(session({
    secret : process.env.secret,
    resave : false,
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



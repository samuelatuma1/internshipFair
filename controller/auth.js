const { response } = require("express")
const express = require("express")
const auth = express.Router()
const {check, validationResult} = require('express-validator')

const {validateSignUpDetails} = require('../validation')


// User decides if he/she is an intern or an employer
auth.route('/')
    .get((req, res) => {
        res.type("html")
        res.status(200).render('auth/role')
    })



// Signs up for Interns. !! Not employers
auth.route('/signup')
    .get((req, res) => {
        res.type("html")
        res.status(200).render('auth/signup')
    })
    .post(validateSignUpDetails, (req, res) => {
        // Handle form Errors
        const validationErrors = validationResult(req).array()
        if(validationErrors.length > 0){
        console.log(validationErrors)

            res.set("Content-Type", 'text/html')
            return res.status(200).render('auth/signup', {errs : validationErrors, formdata : req.body} )
        }

        // If form is_valid


        return res.status(201).send("successful")
    })





module.exports = {
    auth
}
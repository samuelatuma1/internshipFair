const { response } = require("express")
const express = require("express")
const auth = express.Router()
const {check, validationResult} = require('express-validator')

const {addInternData} = require("../models/authModel")
const {validateSignUpDetails} = require('../validation')


// User decides if he/she is an intern or an employer
auth.route('/')
    .get((req, res) => {
        res.type("html")
        res.status(200).render('auth/role')
    })





// Signs up for Interns. !! Not employers
auth.route('/Internsignup')
    .get((req, res) => {
        res.type("html")
        res.status(200).render('auth/signup')
    })
    .post(validateSignUpDetails, async (req, res) => {
        // Handle form Errors
        const validationErrors = validationResult(req).array()
        if(validationErrors.length > 0){
        console.log(validationErrors)

            res.set("Content-Type", 'text/html')
            return res.status(200).render('auth/signup', {errs : validationErrors, formdata : req.body} )
        }

        // If form is_valid
        instanceData = {...req.body, cgpa : req.body.cgpa ? parseFloat(req.body.cgpa) : 0.0}
        // console.log(instanceData)
        try{
            const newIntern = await addInternData(instanceData)
            console.log(newIntern)
            return res.status(200).render('auth/signup', {success : instanceData, formdata : req.body} )   
            
        }catch(err){
            // Error will occur if email already exists
            return res.status(200).render('auth/signup', {dberrs : 'Email is already in use. Please try with another mail', formdata : req.body} )      
        }

    })


auth.route('/InternSignIn')
    .get((req, res) => {
        return res.status(200).send("Welcome to the sign in Page")
    })





module.exports = {
    auth
}
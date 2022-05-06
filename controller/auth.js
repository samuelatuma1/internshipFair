const { response } = require("express")
const express = require("express")
const auth = express.Router()
const {check, validationResult} = require('express-validator')

const {addInternData, signInUser} = require("../models/authModel")
const {validateSignUpDetails} = require('../validation')


// User decides if he/she is an intern or an employer
auth.route('/')
    .get((req, res) => {
        res.type("html")
        res.status(200).render('auth/role')
    })





// Sign up for Interns. !! Not employers
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
            // console.log(newIntern)
            return res.status(200).render('auth/signup', {success : instanceData, formdata : req.body} )   
            
        }catch(err){
            // Error will occur if email already exists
            return res.status(200).render('auth/signup', {dberrs : 'Email is already in use. Please try with another mail', formdata : req.body} )      
        }

    })


auth.route('/InternSignIn')
    .get((req, res) => {
        return res.status(200).render('auth/signin')
    })
    .post(async (req, res) => {
        const formData = req.body
        try{
            // Attempt to validate and sign in user
            let validUser = await signInUser(formData)

            // Add signed In user to session and user id to Cookie
            req.session.signedIn = validUser
            res.cookie("signedIn", validUser._id)
            console.log(req.session.signedIn, req.cookies.signedIn)

            // redirect to profile Page
            return res.redirect(302, './profile_page')
          

        } catch(invalidUser){
            return res.status(200).render('./auth/signin', { errMsg : "Username or Password Incorrect"})
        }

    })


auth.route('/profile_page')
    .get((req, res) => {
        // Redirect to sign in page if no user is signed in
        if(!req.cookies.signedIn){
            return res.redirect(307, './InternSignIn')
        }
        return res.send("You are in the get method of the profile page")
    })
    .post((req, res) => {
        return res.send("You are in the post method of the profile page")
    })


module.exports = {
    auth
}
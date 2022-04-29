const { response } = require("express")
const express = require("express")
const auth = express.Router()
const {check, validationResult} = require('express-validator')

// Form validatons 
const validateSignUpDetails = [
    check("first_name").isLength({in : 2}).custom((val, {req}) => {
         // Ensure first is not Just made up of ' '(space)
         let startChar = ' '
         for(let char of val){
             if (char !== startChar){
                 return val
             }
         }
         throw new Error("Please enter a valid First Name")

    }),
    check("last_name").isLength({in : 2}).custom((val, {req}) => {
        // Ensure first is not Just made up of ' '(space)
        let startChar = ' '
        for(let char of val){
            if (char !== startChar){
                return val
            }
        }
        throw new Error("Please enter a valid Last Name")

   }),
    check("email").isEmail().withMessage("Please, input a valid mail."),
    check("password").isLength({ min : 5}).withMessage("Password must be at least 3 characters Long"),
    check("password").custom((val, {req}) => {
        // Ensure password is not Just a repeat of the same characters

        let startChar = val[0]
        for(let char of val){
            if (char !== startChar){
                return val
            }
        }
        throw new Error("Password should not be completely uniform")

    }),
    check("retype_password").custom((val, {req}) => {
        if (val !== req.body.password){
            throw new Error("Please ensure password and Confirm Password match")
        }
    }) 
]
// End of form validations


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
        const validationErrors = validationResult(req).array()
        if(validationErrors){
            res.set("Content-Type", 'text/html')
            return res.status(200).render('auth/signup', {errs : validationErrors, formdata : req.body} )
        }
        console.log(errs)
        return res.status(201).send("successful")
    })


module.exports = {
    auth
}
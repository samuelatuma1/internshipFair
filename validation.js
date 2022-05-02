// Form validatons 
const {check, validationResult} = require('express-validator')

const filled_with_blanks = (val, {req}, errMsg) => {
    // Ensure val is not Just made up of ' '(space)
    let startChar = ' '
    for(let char of val){
        if (char !== startChar){
            return val
        }
    }
    throw new Error(errMsg)
}

// 
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
        return val
    }),

    check("city").isLength({min : 2}).custom((val, {req}) => {
        // Ensure first is not Just made up of ' '(space)
        let startChar = ' '
        for(let char of val){
            if (char !== startChar){
                return val
            }
        }
        throw new Error("Please enter a valid city Name")

    }).withMessage("Please enter a valid city name"),

    check("institution").isLength({ min : 2 }).custom((val, {req}) => {
        // Ensure first is not Just made up of ' '(space)
        let startChar = ' '
        for(let char of val){
            if (char !== startChar){
                return val
            }
        }
        throw new Error(errMsg)

    }).withMessage("Please enter a valid institution"),

    check("course").isLength({ min : 2}).custom((val, {req}) => {
        let startChar = ' '
        for(let char of val){
            if (char !== startChar){
                return val
            }
        }
        throw new Error(errMsg)
    }).withMessage("Please enter a valid course of study")

]
// End of validate sign up details

module.exports = {validateSignUpDetails}
const {Intern,  InternProfile} = require('./modelSchemas.js')
const mongoose = require("mongoose")

const config = require("dotenv").config()
const crypto = require("crypto")
/**
 * 
 * @param {Object} internData : -> An object containing intern data.
 * sample internData -> {
    first_name: 'Samuel', last_name: 'Atuma', email: 'sam@gmail.com', password: '12345',
    retype_password: '12345', city: 'PH', institution: 'University of Port Harcourt',
    course: 'Petroleum Engineering', cgpa: 4.31
}
* @returns {Promise} Promise Object
 */


async function addInternData (internData) {
    try{
        // Hash Password first
        const hashedPassword = crypto.Hmac('sha256', process.env.secret).update(internData.password).digest("hex")
        const cleanedInternData = {...internData, password : hashedPassword}

        // Remove retype_password from Intern Object
        delete cleanedInternData.retype_password
        // Store cgpa as 0.0 if excluded
        cleanedInternData.cgpa ? cleanedInternData.cgpa : 0.0 

        // Save Intern to DataBase
        const newIntern = await new Intern(cleanedInternData)

        
        // Create Intern Profile
        const internProfile = await new InternProfile({ InternUserId : newIntern._id})
        const saveProfile = await internProfile.save()
        console.log(saveProfile)
        
        // Add Profile_id to InternData
        newIntern.profileId = saveProfile._id

        // saveIntern
        const saveIntern = await newIntern.save()

        return  new Promise(async (resolve, reject) => {
            // console.log(newIntern)
        
            resolve(saveIntern.str())

        })
    } 
    catch(err){
       return  new Promise((resolve, reject) => {
            reject(err)
        })
    }
}


async function signInUser(userForm){
    // Hash Password
    const hashedPassword = crypto.Hmac('sha256', process.env.secret).update(userForm.password).digest("hex")

    // Look up matching username and hashedpassword in database
    const valid = await Intern.where({email : userForm.email}).where({ password : hashedPassword})
    
    return new Promise((resolve, reject) => {
        return valid.length > 0 ? resolve(valid[0]) : reject('Invalid user Name')
    })
}




module.exports  = { addInternData, signInUser }

const {Intern,  InternProfile} = require('./modelSchemas.js')
const mongoose = require("mongoose")

const config = require("dotenv").config()
const crypto = require("crypto")
/**
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

/**
 * @param {Object} userForm :-> req.body object expected properties : email, password
 * @returns {Promise} resolves with 
 */
async function signInUser(userForm){
    // Hash Password
    const hashedPassword = crypto.Hmac('sha256', process.env.secret).update(userForm.password).digest("hex")

    // Look up matching username and hashedpassword in database
    const valid = await Intern.where({email : userForm.email}).where({ password : hashedPassword})
    
    return new Promise((resolve, reject) => {
        return valid.length > 0 ? resolve(valid[0]) : reject('Invalid user Name')
    })
}

/**
 * @param {Object} req :-> The request object
 * @returns {Promise} :-> resolves with the user profile populated signedIn internData Object , rejects with String('No user found')
 */
 async function getSignedInData (req){
    try{
        const userId = req.session.signedIn  || req.cookies.signedIn
        // intern Data
        const internData = await Intern.where({ _id : userId })
                                .populate('profileId')
        if (internData.length > 0){

            return internData[0]
        }
        return 'No user found'
    } catch (e){
        return 'No user Found'
    }
}

/**
 * Modifies Intern in session.signedIn with updated req.body data
 * @param {Object} req : -> The request object
 */
 async function updateInternData(req){
    const internId = req.session.signedIn || req.cookies.signedIn
    if(internId) {
        const modelToModify = req.body.modelToModify
        if(modelToModify === 'Intern'){
            const InternDetails = await Intern.findOne({_id : internId})
            modifiedData = req.body.data

            for(let fieldName in modifiedData){
                InternDetails[fieldName] = modifiedData[fieldName]
            }
            // console.log(InternDetails)
            const saveChanges = await InternDetails.save()
            console.log(saveChanges)
        }
        
    }
}




module.exports  = { addInternData, 
                    signInUser, 
                    getSignedInData, 
                    updateInternData }

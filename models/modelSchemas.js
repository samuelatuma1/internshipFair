const mongoose = require("mongoose")

/**
 * 
 * @param {String || Array} sequence : -> The sequence 
 * @param {*} itemToCount :-> The item to count
 * @returns no_of_occurence of itemToCount in sequence
 */
const countItems = (sequence, itemToCount) => {
    let count = 0
    for(let item of sequence){
        if (item === itemToCount){
            count += 1
        }
    }
    return count
}

const InternSchema = new mongoose.Schema({
    first_name : {
        type : String, required : true, minlength : 2
    },
    last_name : {
        type : String, required : true, minlength : 2
    },
    email : {
        type : String,
        unique : true,
        required : true,
        validate : {
            validator : emailData => {
                if(countItems(emailData, '@') !== 1) return false
                return true
            },
            message : 'Invalid email format'
        }
    },
    is_active : {
        type : Boolean, default : true
    },
    password : {  
        type : String, required : true, minlength : 5
    },
    city : {
        type : String, required : true, minlength : 1
    },
    institution : {
        type : String, required : true, minlength : 2
    },
    cgpa : {
        type : Number, max : 5.0, min : 0
    },

    chats : {
        type : Object,
        default : {}
    }
})

InternSchema.methods.str = function (){
    return `${this.first_name} ${this.last_name} <${this.email}>`
}


/**
 * 
 * @param {Object} internData : -> An object containing intern data.
 * sample internData -> {
    first_name: 'Samuel', last_name: 'Atuma', email: 'sam@gmail.com', password: '12345',
    retype_password: '12345', city: 'PH', institution: 'University of Port Harcourt',
    course: 'Petroleum Engineering', cgpa: '4.31'
}
* @returns {Promise} 
 */

const Intern = mongoose.model('Intern', InternSchema)
module.exports  = { Intern }


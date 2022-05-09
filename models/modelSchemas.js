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
    },
    updatedAt : {
        type : Date,
        default : () => Date.now()
    },
    profileId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "InternProfile"
    }
})

InternSchema.methods.str = function (){
    return `${this.first_name} ${this.last_name} <${this.email}>`
}
InternSchema.pre("save", function(next){
    this.updatedAt = Date.now()
    next()
})
const Intern = mongoose.model('Intern', InternSchema)



const InternProfileSchema = new mongoose.Schema({
    InternUserId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'Intern',
        required : true
    },
    InternStatus : {
        type : String,
    },
    InternProfileImgUrl : {
        type : String
    },
    InternResumeUrl : {
        type : String
    },
    updatedAt : {
        type : Date
    }
})


InternProfileSchema.methods.getIntern = async function(){
    const internId = this.InternUserId
    try{
        const intern = await Intern.findOne({_id : internId})
        return intern
    }
    catch(err){
        console.log(err)
    }
}
InternProfileSchema.pre("save", function(next) {
    this.updatedAt = Date.now()
    next()
})
const InternProfile = mongoose.model("InternProfile", InternProfileSchema)
module.exports  = { Intern,  InternProfile }


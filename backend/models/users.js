var mongoose = require('mongoose');
// for passpword encrption
const bcrypt = require('bcryptjs') ;

const validator = require('validator');

const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema ;

// create the schema for user 

var UserSchema = new Schema({

     
        email: {

            unique:true,
            type: String,
            required :true ,
            lowercase : true ,   
            validator(value){
              if(!validator.isEmail(value)){
                throw new Error("email is invalid")
              }
            }

          },
        password: {
            type: String,
            minlength : [4,'Password must be at least 4 character long'] ,
            trim:true ,
            required :true ,
        },

        tokens: [{
          token: {
            type: String,
            required: true
        }
    
        }]
     
    
});


// generating authentication tokens


UserSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'AuthUser')

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}




// when logining
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
      throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
      throw new Error('Unable to login')
  }

  return user
}


UserSchema.pre('save',async function(next){

  // correct hashing
  const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})






const User = mongoose.model('User', UserSchema);

module.exports = User ;

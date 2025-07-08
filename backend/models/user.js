const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true},
  password: { type: String, required: true },
  role: {type: String ,enum : ['user', 'admin'], default: 'user'}
}, { timestamps: true });


userSchema.pre('save', async function (next) {
   next()
})

const User = mongoose.model('user', userSchema);
module.exports = User

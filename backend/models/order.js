const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema =  new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
   items: [
      {
         product_id: { type: Schema.Types.ObjectId, ref: 'product', required: true},
         quantity: { type: Number, required: true, min: 1 },
        
      }
   ],
   total: {type: Number, required: true},
   status: {type: String, default: 'pending', enum: ['pending','shipped', 'completed', 'cancelled'  ], lowercase: true},
   address: {type: String}
}, {timestamps: true})



const  Order = mongoose.model('order', orderSchema)
module.exports = Order
const Boom = require("boom");
const Order = require("../../models/order");
const OrderSchema = require("./validations");



const Create = async (req, res, next) => {
   const {user_id, items, total} = req.body
   // const {error} = OrderSchema.validate({user_id, items, total})
   // if (error) {
   //    return next(Boom.badRequest(error.details[0].message));
   //  }

   try {
      const order = new Order({user: user_id, items, total})
      await order.save()
      res.json({message: 'Order saved successfully', order})
   } catch (e) {
      console.error(e.message)
      next(e)
   }
}

const GetMyOrder = async (req, res, next) => {
   const {user_id} = req.params
   try {
      const order = await Order.find({user: user_id})
      if(!order) {
         return Boom.notFound('No order found')
      }
      res.json({ order , success: true})
   } catch (e) {
      console.log(e)
      next(e)
   }
}


const UpdateOrder = async (req, res, next) => {
   const {order_id,  status } = req.body;
   try {
     const order = await Order.findByIdAndUpdate(order_id, { status }, { new: true });
     res.json(order);
   } catch (e) {
      console.log(e)
     next(e)
   }
}

// List all orders
const List = async (req, res, next) => {
   try {
     const orders = await Order.find()
       .populate('user_id', '-password -__v')
       .populate('items.product_id');
 
     res.status(200).json(orders);
   } catch (e) {
     next(e);
   }
 };


module.exports = {List,  Create, GetMyOrder, UpdateOrder}
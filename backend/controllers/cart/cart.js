const Cart = require("../../models/cart");
const Boom = require('boom');
const Product = require("../../models/product");



const AddCart = async (req, res, next) => {
   const { user_id, product_id, quantity } = req.body;

   try {
      let cart = await Cart.findOne({ user: user_id });
      if (!cart) {
         cart = new Cart({ user: user_id, items: [] });
      }
      
      // Ensure items array structure is consistent
      const productIndex = cart.items.findIndex((item) => item.product_id.toString() === product_id);

      if (productIndex > -1) {
         cart.items[productIndex].quantity += quantity; // Update quantity
      } else {
         cart.items.push({ product_id, quantity }); // Add new product
      }

      await cart.save();
      res.json({ message: 'Cart successfully updated', cart: cart.items });
   } catch (e) {
      console.error('Error in AddCart:', e);
      next(e);
   }
};

const GetCart = async (req, res, next) => {
   const {user_id} = req.params
   let limit = 5
   const page = parseInt(req.query.page) || 1

   const skip = (page - 1) * limit
   
   try {
      const cart = await Cart.findOne({user: user_id}).populate('items.product_id').skip(skip).limit(limit)
      const cartCount= await Cart.countDocuments()

      if(!cart){
         return next(Boom.notFound('Cart not found'))
      }

      if(cart.length === 0){
         return Boom.notFound('Cart is empty')
      }
      res.json({ cart, cartCount, totalCart : Math.ceil(cartCount/limit) , currentPage: page })
   } catch (err) {
      console.log(err.message)
      next(err)
   }
};


const RemoveFromCart = async (req, res, next) => {
   const { user_id, product_id } = req.query;

   try {
      const cart = await Cart.findOne({ user: user_id });
      if (!cart) {
         return next(Boom.notFound('Cart not found'))
      }
      cart.items = cart.items.filter(item => item.product_id.toString() !== product_id);
      await cart.save();
      res.json({ message: 'Item removed successfully', items: cart.items });
   } catch (e) {
      console.log(e.message);
      next(e);
   }
};
const UpdateCart = async (req, res, next) => {
   const { quantity , user_id, product_id } = req.body;
 
   try {
     // Validate quantity
     if (quantity === undefined || quantity < 0) {
       return Boom.badData('Invalid Quantity');
     }
 
     // Find the user's cart
     const cart = await Cart.findOne({ user: user_id });
 
     if (!cart) {
       return next(Boom.notFound('Cart not found'))
     }
 
     // Find the product in the cart
     const productIndex = cart.items.findIndex(
       (item) => item.product_id.toString() === product_id
     );
 
     if (productIndex === -1) {
       return  next(Boom.notFound(`Prodcut with $${product_id}  not found in cart`))
     }
 
     if (quantity === 0) {
       // Remove the product if the quantity is set to 0
       cart.items.splice(productIndex, 1);
     } else {
       // Update the quantity
       cart.items[productIndex].quantity = quantity;
     }
 
     // Save the updated cart
     await cart.save();
 
     res.status(200).json({
       message: "Cart updated successfully",
       cart,
     });
   } catch (err) {
     console.error(`Error updating cart for user_id: ${user_id}`, err);
     next(err); // Pass the error to the next middleware
   }
 };
 

 const ClearCart = async (req, res, next) => {
   const { user_id } = req.body;
   try {
     const cart = await Cart.findOne({ user: user_id });
     if (!cart) {
       return res.status(404).json({ error: 'Cart not found' });
     }

     await cart.deleteOne({user: user_id})
     res.json({ message: 'Cart cleared successfully' });
   } catch (err) {
     console.log(err);
     next(err);
   }
 };
 
 

 module.exports = { UpdateCart, RemoveFromCart, AddCart, GetCart, ClearCart}
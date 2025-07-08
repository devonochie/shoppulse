const Boom = require('boom');
const ProductSchema = require("./validations");
const Product = require('../../models/product');
const mongoose = require('mongoose')
const limit = 50; // Define a global limit for pagination

const Create = async (req, res, next) => {
  const input = req.body;

  // Validate the input using the schema
  const { error } = ProductSchema.validate(input);
  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  try {
    // Add the photo path if a file was uploaded
    const photo = req.file ? req.file.path.replace(/\\/g, '/') : null;

    // Create a new Product instance with the input and photo
    const product = new Product({
      ...input,
      photo: photo // Explicitly include photo in the object
    });

    // Save the product to the database
    const savedData = await product.save();
    res.json(savedData);
  } catch (e) {
    next(e);
  }
};


const GetList = async (req, res, next) => {
   let page  = req.query.page ;
   page = parseInt(page) || 1;
   const skip = (page - 1) * limit;
 
   try {
     const products = await Product.find()
       .sort({ createdAt: -1 })
       .skip(skip)
       .limit(limit)
 
     res.json(products);
   } catch (e) {
      console.error(e.message)
     next(e);
   }
 };
 

const Get = async (req, res, next) => {
  const  product_id  = req.params.id

  if (!product_id) {
    return next(Boom.badRequest("Missing parameter (:product_id)"));
  }

  if (!mongoose.Types.ObjectId.isValid(product_id)) {
    return next(Boom.badRequest("Invalid product ID format."));
  }

  try {
    const product = await Product.findById(product_id);
    if (!product) {
      return next(Boom.notFound("Product not found."));
    }
    
    res.json(product);
  } catch (e) {
   console.log(e.message)
    next(e);
  }
};

const Update = async (req, res, next) => {
  const  product_id  = req.params;

  try {
    const updated = await Product.findByIdAndUpdate(product_id, req.body, {
      new: true,runValidators: true
    });
    if (!updated) {
      return next(Boom.notFound("Product not found."));
    }
    res.json(updated);
  } catch (e) {
    next(e);
  }
};

const Delete = async (req, res, next) => {
  
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      throw Boom.notFound("Product not found.");
    }
    res.json(deleted);
  } catch (e) {
   console.log(e.message)
    next(e);
  }
};

const Search = async (req, res, next) => {

   try {
    const term = req.query.term?.trim()
    if(!term){
      return next(Boom.notFound('Search is required'))
    }

    const product = await Product.find({
      $or: [
        {title: {$regex: term, $options:'i' } },
        {description: {$regex: term, $options: 'i'} },
        {category: {$regex: term, $options: 'i'}}
      ]
    }).populate()

    if (product.length === 0) {
      const suggestion = await Product.find({
        category: { $regex: term, $options: 'i' },
      }).limit(5)
      return res.json({
        success: false,
        message: "No exact matches found, Here are some suggestions.",
        suggestion
      })
    }

    
    res.json({success: true, product})
   } catch (err) {
    next(err)
   }
}


module.exports = {
  Create,
  Get,
  Update,
  Delete,
  GetList,
  Search
};

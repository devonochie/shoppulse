import mongoose, { Schema, Document, Model } from 'mongoose';
import { Product as ProductValidator } from '../validators/product.validators';

interface IProduct extends ProductValidator {
    subCategory?: string
    sizes: string[]
    colors: string[]
    reviewCount: number
    featured: boolean
    tags: string[]
}

export interface ProductDocument extends IProduct, Document {}

const productSchema: Schema = new Schema<ProductDocument> ({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0.01, 'Price must be positive'],
        max: [1000000, 'Price cannot exceed $1,000,000'],
        set: (val: number) => parseFloat(val.toFixed(2)) // Ensure 2 decimal places
    },
    images: {
        type: [String],
        required: [true, 'At least one image URL is required'],
        validate: {
            validator: function (arr: string[]) {
                return (
                    Array.isArray(arr) &&
                    arr.length > 0 &&
                    arr.every((v) =>
                    /^https?:\/\/.+(\.jpg|\.jpeg|\.png|\.webp)$/i.test(v)
                    )
                );
            },
            message:
            'Each image must be a valid URL ending with .jpg, .jpeg, .png, or .webp',
        },
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    rating: {
        type: Number,
        min: [0, 'Rating cannot be below 0'],
        max: [5, 'Rating cannot exceed 5']
    },
    sizes: { type: [String] },
    colors: { type: [String] },
    reviewCount: { type: Number},
    featured: { type: Boolean, default: false},
    tags: { type: [String] }
    
}, { 
    timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

productSchema.index({ title: 'text', description: 'text' })
productSchema.index({ category: 1, price: 1 })

productSchema.virtual('priceFormatted').get(function(this: IProduct) {
    return `$${this.price.toFixed(2)}`;
});


const Product: Model<ProductDocument> = mongoose.model<ProductDocument>("Product", productSchema)

export default Product
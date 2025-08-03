/* eslint-disable @typescript-eslint/no-unused-vars */
import Product from "src/models/product";
import express from 'express';
import { validatePartailProduct, validateProduct } from "src/validators/product.validators";
import logger from "src/utils/logger";
import { UserRole } from "src/models/auth";



class ProductController {

    constructor(
        private productModel : typeof Product
    )  {}

    async createProduct (req: express.Request, res: express.Response, _next: express.NextFunction) {
        const validation = validateProduct(req.body) 
        if(!validation.success ) {
            return res.status(400).json({ errors: validation.error.message})
        }

        try {
            const productPhoto: string | null = req.file ? req.file.path.replace(/\\/g, '/') : null;
            const product = new this.productModel({
                ...validation.data,
                image: productPhoto
            })

            await product.save()

            return res.success({
                product
            }, "product created successfully")
            
        } catch (error: unknown) {
            logger.error('Error searching products:', error instanceof Error ? error.message : 'Unknown error');
            return res.error('Error searching products', 500);
        }
    }

    async getProducts( req: express.Request, res: express.Response, _next: express.NextFunction ) {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string ) ||  10;
        const skip = (page - 1) * limit

        try {

            const products = await this.productModel.find()
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .sort({ createdAt: -1 })

            const total = await this.productModel.countDocuments()

            return res.success({
                data: products,
                meta: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            })
        } catch (error: unknown) {
            logger.error('Error searching products:', error instanceof Error ? error.message : 'Unknown error');
            return res.error('Error searching products', 500);
        }
    }

    async getProductById (req: express.Request, res: express.Response, _next: express.NextFunction ) {
        try {
            const product = await this.productModel.findById(req.params.id) 
            if(!product) return res.status(404).json({ message: "Product not found"})

            return res.success({
                product
            })
    
        } catch (error: unknown) {
            if ( error instanceof Error ) {
                logger.error("Error getting peoduct:", error.message)
            }
            res.error('Error getting Product', 500)
        }
    }

    async updateProduct (req: express.Request, res: express.Response, next: express.NextFunction ) {
        const validaition = validatePartailProduct(req.body) 
        if(!validaition.success) {
            return res.status(400).json({ error: validaition.error.message })
        }

        try {
            const product = await this.productModel.findByIdAndUpdate(
                req.params.id,
                validaition.data,
                { new: true, runValidators: true }
            )

            if(!product) return res.status(404).json({ messaga: "Product not found" })

            return res.success({
                data: product
            }, "Product Updated successfully")
        } catch (error) {
            next(error)
            logger.error('Error searching products:', error instanceof Error ? error.message : 'Unknown error');
            return res.error('Error searching products', 500);
            
        }
    }

    async deleteProduct (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const product = await this.productModel.findByIdAndDelete(req.params.id) 
            if (!product) return res.status(404).json({ message: 'Product not found' });

            return res.success()
        } catch (error: unknown) {
            next(error)
            logger.error('Error searching products:', error instanceof Error ? error.message : 'Unknown error');
            return res.error('Error searching products', 500);
        }
    }

    async searchProduct(
        req: express.Request,
        res: express.Response,
        _next: express.NextFunction
        ) {
        const { q, category, minPrice, maxPrice, page = '1', limit = '10' } = req.query;

        try {
            const query: {
            $text?: { $search: string };
            category?: RegExp;
            price?: { $gte?: number; $lte?: number };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
            } = {};

            // Text search (using MongoDB text index)
            if (q) {
            const searchTerm = q.toString().trim();
            if (searchTerm) {
                query.$text = { $search: searchTerm };
            }
            }

            // Category filter (case-insensitive regex)
            if (category) {
            query.category = new RegExp(category.toString().trim(), 'i');
            }

            // Price range filter
            if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice.toString());
            if (maxPrice) query.price.$lte = parseFloat(maxPrice.toString());
            }

            const pageNum = parseInt(page.toString());
            const limitNum = parseInt(limit.toString());
            const skip = (pageNum - 1) * limitNum;

            const [products, total] = await Promise.all([
            this.productModel
                .find(query)
                .skip(skip)
                .limit(limitNum)
                .lean(), // Convert to plain JS objects
            this.productModel.countDocuments(query),
            ]);

            return res.success({
            data: products,
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
            });
        } catch (error) {
            logger.error('Error searching products:', error instanceof Error ? error.message : 'Unknown error');
            return res.error('Error searching products', 500);
        }
        }
}


export default ProductController
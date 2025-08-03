import express from 'express'
import { authMiddleware } from '../../middleware/http.middleware';
import ProductController from 'src/controllers/product.controller';
import Product from 'src/models/product';
import { authorize } from 'src/middleware/role.middleware';
import { UserRole } from 'src/models/auth';
import upload from 'src/utils/file.upload';



const routes: express.Router = express.Router()
const productController = new ProductController(Product)

routes.post('/', authMiddleware, 
    authorize([UserRole.ADMIN]), 
    upload.single('image'),  
    productController.createProduct.bind(productController)
)

routes.get('/', 
    productController.getProducts.bind(productController)
);
routes.get('/search', 
    productController.searchProduct.bind(productController)
);
routes.get('/:id', 
    productController.getProductById.bind(productController)
);
routes.patch('/:id', 
    authMiddleware, 
    authorize([UserRole.ADMIN]), 
    upload.single('image'),
    productController.updateProduct.bind(productController)
);
routes.delete('/:id', 
    authMiddleware, 
    authorize([UserRole.ADMIN]), 
    productController.deleteProduct.bind(productController)
);

export default routes
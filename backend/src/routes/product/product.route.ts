import ProductController from '../../controllers/product.controller';
import { authMiddleware } from '../../middleware/http.middleware';
import { authorize } from '../../middleware/role.middleware';
import { UserRole } from '../../models/auth';
import Product from '../../models/product';
import upload from '../../utils/file.upload';
import express from 'express'


const routes: express.Router = express.Router()
const productController = new ProductController(Product)

routes.post('/', authMiddleware, 
    authorize([UserRole.ADMIN]), 
    upload.array('images', 5), 
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
    upload.array('images', 5), 
    productController.updateProduct.bind(productController)
);
routes.delete('/:id', 
    authMiddleware, 
    authorize([UserRole.ADMIN]), 
    productController.deleteProduct.bind(productController)
);

export default routes
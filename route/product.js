import express from 'express'
const router = express.Router();
import product from '../controller/product.js'
import { body, param } from 'express-validator';
import message from '../helper/message.js'

router.post('/add',
    [
        body("name").exists().withMessage(message.PRODUCT_NAME_REQUIRED).isLength({ min: 2 }).withMessage(message.INVALID_PRODUCT_NAME),
        body("price").exists().withMessage(message.PRODUCT_PRICE_REQUIRED).withMessage(message.INVALID_PRICE),
        body("mrp").exists().withMessage(message.PRODUCT_MRP_REQUIRED).isInt().withMessage(message.INVALID_MRP),
    ]
    , product.addProduct)

router.get('/list', product.productList)

router.get('/list/specifiedId', product.productListInSpecifiedId)

router.put('/update/:productId',
    param('productId').exists().withMessage(message.PRODUCT_ID_REQUIRED).isMongoId().withMessage(message.INVALID_PRODUCT_ID)
    , product.updateProduct)

router.delete('/delete/:productId',
    param('productId').exists().withMessage(message.PRODUCT_ID_REQUIRED).isMongoId().withMessage(message.INVALID_PRODUCT_ID)
    , product.deleteProduct)

router.post('/addToCart/', product.addToCart)

router.post('/removeFromCart/', product.removeProductFromCart)

router.post('/order', product.placeOrder)

router.get('/viewCart/', product.viewCart)

export default router
import {deleteProduct, filterProducts, findOneProduct, getAllProducts, searchProduct} from "../controller/productController.js"
import express from "express";
const productRoute=express.Router();


productRoute.get("/allProducts",getAllProducts);
productRoute.get("/searchProduct",searchProduct);
productRoute.get("/filterProducts",filterProducts);
productRoute.get("/findOneProduct/:id",findOneProduct);
export default productRoute;
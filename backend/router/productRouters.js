import {deleteProduct, filterProducts, findOneProduct, getAllProducts,postProduct, searchProduct} from "../controller/productController.js"
import express from "express";
const productRoute=express.Router();


productRoute.get("/allProducts",getAllProducts);
productRoute.post("/addProduct",postProduct);
productRoute.get("/searchProduct",searchProduct);
productRoute.get("/filterProducts",filterProducts);
productRoute.get("/findOneProduct/:id",findOneProduct);
productRoute.delete("/deleteProduct/:id",deleteProduct);
export default productRoute;
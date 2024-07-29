const router = require('express').Router();
const { isValidObjectId } = require('mongoose');
const {verifyToken , verifyTokenAndAdmin} = require('../middleware/auth.middleware.js');
const Product = require('../models/product.model.js');
const {uploadOnCloudinary , deleteFromCloudinary} = require('../utils/cloudinary.js');
const upload = require("../middleware/multer.midddleware.js");

//Create Product 

router.route('/create').post(verifyTokenAndAdmin, upload.single("image"),async (req,res)=>{
    const {name, desc , categories , size , color ,price} = req.body;

    try {
        if(!name || !desc || !price || !size || !color) {
            return res.status(400).json("Name , Desc and Prices are required fields");
        }
    
        const imageLocalPath = req.file?.path;
        if(!imageLocalPath) return res.status(400).json(" Upload image !! ");

        const image = await uploadOnCloudinary(imageLocalPath);
        if(!image) return res.status(500).json("Can't Upload image !! Please Try Again Later ");

        const product = await Product.create({
            name,
            desc,
            price,
            categories,
            size,
            color,
            image: {
              url:image.url,
              public_id : image.public_id
            },
        })
        if(!product) return res.status(500).json("Can't Create !! Please Try Again Later ");
        
        return res.status(200).json({msg : "Product Created" , product})
    } catch (error) {
        console.log(error);
        return res.status(500).json("Try again");
    }

})

//Update Product

router.route('/update/:productId').patch(verifyTokenAndAdmin, upload.single("image"), async (req,res)=>{
 const { productId } = req.params;
 const {desc , categories , size , color ,price} = req.body;

 try {
   if(!desc || !price || !size || !color) {
     return res.status(400).json("Desc , Prices, Size & Color  are required fields");
   }
 
   if(!isValidObjectId(productId)) return  res.status(400).json("Invalid Product");
 
   const product = await Product.findById(productId);
   if(!productId) return  res.status(404).json("Product Not Found");
 
   const imageLocalPath = req.file?.path;
   const image = await uploadOnCloudinary(imageLocalPath);
   if(!image) return  res.status(500).json("Can't Upload Image");
 
   const deletedImage = await deleteFromCloudinary(product?.image?.public_id);
   if(!deletedImage) return  res.status(500).json("Can't Delete Image");
 
   const updatedProduct = await Product.findByIdAndUpdate(productId, {
     desc,
     price,
     categories,
     size,
     color,
     image: {
       url:image.url,
       public_id : image.public_id
     }
   },{new:true})
   if(!updatedProduct) return res.status(500).json("Can't Update Product Detail !! Please TryAgain");
 
   return  res.status(200).json({msg:"Product Updated" , data : updatedProduct});
 } catch (error) {
    console.log(error);
    return  res.status(500).json("Can't Update !! Please TryAgain");
 }

})

//Get Product By Id
router.route("/get/:id").get(verifyToken, async (req,res)=>{
   const {id} = req.params;
   try {
    if(!isValidObjectId(id)) return res.status(402).json("Invalid Id");
 
    const product = await Product.findById(id);
    if(!product) return res.status(500).json("Product not Found");
 
    return res.status(200).json({msg:"Product Found",data:product} );
   } catch (error) {
      console.log(error)
      return res.status(502).json("try Again");
   }
})

//getProductByQueries

router.route('/').get(verifyToken, async(req,res)=>{
  const {category, newProduct} = req.query;
  try {
      
      let products="";
      if(category){
        products = await Product.find({categories:{$in:[category]}})

      }else if(newProduct){
        products = await Product.find().sort({createdAt : -1}).limit(10)
      }else{
        products = await Product.find()
      }
      console.log(products)
      if(!products) return res.status(500).json("No Product Found")
      
      return res.status(200).json({msg:"Fetched Successfully",data:products})
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({msg:"Data Not Found",error:error})
  }
   
})


module.exports = router;
import Product from "../models/product.model.js";
import cloudinary from "cloudinary";
import fs from "fs";

const createProduct = async (req, res) => {
  /**
   * 1. Take all the necessary  data from req.body to create a new product
   */
  const productData = req.body;
  console.log(productData);
  /**
   * 2. check the all data are  provided or not if yes then go to next step
   */
  if (
    !productData.title ||
    !productData.price ||
    !productData.description ||
    !productData.category ||
    !productData.brand
  ) {
    return res.status(401).json({
      success: false,
      message: "All mandatory fields are required.",
    });
  }
  try {
    /**
     * 3.If all required data are present then create  a product
     */
    const product_data = {
      title: productData.title,
      price: productData.price,
      description: productData.description,
      category: {
        name: productData.category,
      },
      imageRelatedProduct: [],
      rating: {
          rate: productData.rate,
        },
        brand: productData.brand,
      
    };

    const createProduct = await Product.create(product_data);

    if (!createProduct) {
      return res.status(501).json({
        success: false,
        message: "Failed to create Product.",
      });
    }
    /**
     * 4. If once product database create then upload image of product in cloudinary and save the give url into product image section .
     */
    if (req.files && req.files.length > 0) {
        console.log("All image file are:", req.files);
      try {
        let result ; 

        for(const file of  req.files){
            
             result = await cloudinary.v2.uploader.upload(file.path, {
              folder: "E-comm_products",
            });

            console.log("Image uploaded in Cloudinary",result);

            if(result){
                createProduct.imageRelatedProduct.push({
                    public_Id: result.public_id,
                    secure_url: result.secure_url
                  });
            }

            fs.unlinkSync(file.path);
        }

        await createProduct.save();
      } catch (error) {
        console.log("Error in uploading Image", error);
        return res.status(501).json({
          success: false,
          message: "Failed to upload image.Please try again",
        });
      }
    }
    /**
     * if all are successfully done then response true to the user
     */
    const prod = await Product.find({ title: productData.title });

    createProduct.rating.count = prod.length;

    await createProduct.save();

    const sendProduct = {
      title: createProduct.title,
      price: createProduct.price,
      description: createProduct.description,
      category: createProduct.category,
      image: createProduct.imageRelatedProduct,
      brand: createProduct.brand,
      rating: createProduct.rating,
    };
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: sendProduct,
    });
  } catch (error) {
    console.log("Error while creating product", error);
    return res.status(501).json({
      success: false,
      message: "Failed to create new Product.Please try again",
    });
  }
};

const getProducts = async (req, res) => {
      /**
       * 1. fetch all the product list from database and send to the  client side
       */
      try {
            const productList =  await Product.find();

            if(!productList){
                 return res.status(401).json({
                       success:false,
                       message:"No  products found"
                 });
            }

            return  res.status(201).json({
                         success :true ,
                         count   :productList.length,
                         data    :productList
               }) ;
      } catch (error) {
         console.log("Error in getting products ", error);
        return res.status(501)
          .json({
            success: false,
            message: "Server Error! Can't retrieve product list.",
            });
      }
};

const updateProduct = async (req, res) => {
          const {title , price , rating , description} = req.body;

          const  id= req.params.id;

        console.log("updated product fields are ",title,price,rating,description);

      if(!title &&  !price && !rating && !description ){
             return res.status(401).json({success:false, message: "Provide at least one fields"})
      }
       
      try {
        
        const product =  await Product.findById(id);
        if (!product ) {
           return res.status(404).json({success:false,message:"No such product present"});
        }
  
        if(title) product.title = title;
        if(price) product.price = price;
        if(rating)  product.rating.rate = rating;
        if(description) product.description = description;
  
        await product.save();
  
        res.status(201).json({
               success:true,
               message:"Product updated Successfully",
               data:product
        })

      } catch (error) {
        console.log("Error in updating the product", error);
        return res.status(501)
          .send(`Error when updating the product -> ${error}/n`);
      }
      }
     
    

const deleteProduct = async (req, res) => {
   
           const id = req.params.id;

           try {
                const deleteProduct = await  Product.deleteOne({_id : id});

                if(deleteProduct){
                   return res.status(201).json({
                          success:true,
                          message:"Successfully deleting the product",
                   })
                }else{
                   return res.status(501).json({
                          success:false,
                          message:"No such product found "
                   });
                }

           } catch (error) {
               console.log("Error in deleting the product ", error);
               return res.status(501)
                 .send(`Error when deleting the product -> ${error}`);
           }
};

export { createProduct, getProducts, updateProduct, deleteProduct };

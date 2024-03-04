// This category functionalities is handle by only admin not customer..

import Category from "../models/category.model.js";

const createCategory = async (req, res) => {
  /**
   * 1. Take  the data from the request body
   */
  const categoryData = req.body;

  /**
   * 2. check the data is present or not
   */
  if (!categoryData.name || !categoryData.description) {
    return res.status(401).json({
      success: false,
      message: "All category fileds are required",
    });
  }
  /**
   * 3 . if the all data fileds are present then create the category database collection
   */

  try {
    const categorydata = await Category.create({
      name: categoryData.name,
      description: categoryData.description,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully created your category .",
      data: categorydata,
    });
  } catch (error) {
    console.log("Error in creating a new Category : ", error);
    return res.status(501).json({
      success: false,
      message: "Failed to create category.Please try again!",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    // Get data from db
    const allCategoryData = await Category.find();

    if (!allCategoryData) {
      return res.status(501).json({
        success: false,
        message: "Not found any category data. Please add some categories.",
      });
    }

    // if category data is found then return it
    return res.status(201).json({
      success: true,
      message: "Successfully got all categories.",
      count: allCategoryData.length,
      data: allCategoryData,
    });
  } catch (error) {
    console.log("Error in getting All Categories : ", error);
    return res.status(501).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateCategory = async (req, res) => {
  /**
   * 1. Take update information through the body
   */
  const id = req.params.id;
  const updates = req.body;
  /**
   * 2. check the given fields
   */
  if (!updates.name && !updates.description) {
    return res.status(401).json({
      success: false,
      message: "Please provide at least a name or description to update.",
    });
  }
  /**
   * 3. if the given fields are provide correct then update categoty database  otherwise send an error massage to user that what
   */
  try {
    const updateCategory = await Category.findById(id);

    if(!updateCategory){
        return res.status(401).json({
               success:false,
               message:"No such category exists."
        });
    }
    
    if(updates.name){
         updateCategory.name = updates.name;
    }

    if(updates.description){
        updateCategory.description = updates.description;
    }
    
    await updateCategory.save();

    return res.status(201).json({
           success:true,
           message:"category updated successfully.",
           data:updateCategory
    })
  } catch (error) {
    console.log("Error in updating Category : ", error);
    return res.status(501).json({
      success: false,
      message: "Internal Server Error or Failed to update category",
    });
  }
};

const deleteCategory = async (req, res) => {
   
     const id = req.params.id;

     try {
           const category =  await Category.findOneAndDelete({_id:id});

            if(!category){
               return res.status(401).json({
                     success:false,
                     message:"No such category found.Please try again"
               });
            }
           
            return  res.status(201).json({
                    success:true,
                    message:"category deleted successfully."
            });

     } catch (error) {
        console.log("Error while deleting the category",error);
        return res.status(501).json({
               success:false,
               message:"failed to deleting category"
        });
     }

};

export { createCategory, getAllCategories, updateCategory, deleteCategory };

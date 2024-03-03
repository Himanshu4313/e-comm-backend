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
           success:true,
           message:"Successfully created your category .",
           data:categorydata
    });
  } catch (error) {
    console.log("Error in creating a new Category : ", error);
    return res.status(501).json({
      success: false,
      message: "Failed to create category.Please try again!",
    });
  }
};

const getAllCategories = async (req, res) => {};

const updateCategory = async (req, res) => {};

const deleteCategory = async (req, res) => {};

export { createCategory, getAllCategories, updateCategory, deleteCategory };

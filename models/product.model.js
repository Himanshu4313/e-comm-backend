import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title fields are mandatory"],
    },
    price: {
      type: String,
      required: [true, "price fields are mandatory"],
    },
    description: {
      type: String,
      required: [true, "description fields are mandatory"],
    },
    category: {
      //    type:mongoose.Schema.Types.ObjectId,
      //    ref: 'Category'  //referencing the Category model
      name: {
        type: String,
        required: [true, "Product category fields are mandatory"],
      },
    },

    imageRelatedProduct: [],
    rating: {
      rate: {
        type: String,
      },

      count: {
        type: Number,
      },
    },

    brand: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

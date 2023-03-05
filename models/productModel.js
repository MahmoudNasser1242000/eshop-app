const mongoose = require("mongoose");

// create schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "product title must be unique"],
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    mainCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "mainCategory",
    select: "name -_id",
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imgURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imgURL;
  }

  if (doc.images) {
    const imageslList = [];
    doc.images.forEach((img) => {
      const imgURL = `${process.env.BASE_URL}/products/${img}`;
      imageslList.push(imgURL);
    });
    doc.images = imageslList;
  }
};

productSchema.post("init", (doc) => {
  setImageURL(doc);
});

productSchema.post("save", (doc) => {
  console.log(doc);
  setImageURL(doc);
});
// create module
const productModle = mongoose.model("product", productSchema);

module.exports = productModle;

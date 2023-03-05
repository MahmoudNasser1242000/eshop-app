const mongoose = require("mongoose");

// create schema
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subategory must be unique"],
      minlength: [3, "Too short subcategory name"],
      maxlength: [32, "Too long subcategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    mainCategory: {
       type: mongoose.Schema.ObjectId,
       ref: 'category',
       required: [true, "subcategory must have a parent category"] 
    },
    image: String
  },
  { timestamps: true }
);


subcategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'mainCategory',
    select: 'name -_id',
  });
  next();
});

subcategorySchema.post("init", (doc) => {
  const imgURL = `${process.env.BASE_URL}/subCategories/${doc.image}`;
  doc.image = imgURL;
});

subcategorySchema.post("save", (doc) => {
  const imgURL = `${process.env.BASE_URL}/subCategories/${doc.image}`;
  doc.image = imgURL;
});

// create module
const subcategoryModle = mongoose.model("subcategory", subcategorySchema);

module.exports = subcategoryModle;
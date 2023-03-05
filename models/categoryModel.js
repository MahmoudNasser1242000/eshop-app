const mongoose = require("mongoose");

// create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

categorySchema.post("init", (doc) => {
  const imgURL = `${process.env.BASE_URL}/categories/${doc.image}`;
  doc.image = imgURL;
});

categorySchema.post("save", (doc) => {
  const imgURL = `${process.env.BASE_URL}/categories/${doc.image}`;
  doc.image = imgURL;
});

// create module
const categoryModle = mongoose.model("category", categorySchema);

module.exports = categoryModle;

const mongoose = require("mongoose");

// create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand required"],
      unique: [true, "brand name must be unique"],
      minlength: [3, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String
  },
  { timestamps: true }
);

brandSchema.post("init", (doc) => {
  const imgURL = `${process.env.BASE_URL}/brands/${doc.image}`;
  doc.image = imgURL;
});

brandSchema.post("save", (doc) => {
  const imgURL = `${process.env.BASE_URL}/brands/${doc.image}`;
  doc.image = imgURL;
});

// create module
const brandModle = mongoose.model("brand", brandSchema);

module.exports = brandModle;
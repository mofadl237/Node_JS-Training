import mongoose from 'mongoose'

export const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    unique: [true, "Name must be unique"],
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    trim: true,
    unique: [true, "Slug must be unique"],
    lowercase: true,
  },
  image: {
    type: String,
    //required: [true, "Image is required"],
  },
},{timestamps: true});

export const CategoryM = mongoose.model("Category", categorySchema);


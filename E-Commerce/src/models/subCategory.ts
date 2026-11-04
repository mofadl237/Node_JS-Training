import mongoose from "mongoose";

export const subCategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }
}); 

export const SubCategoryM = mongoose.model("SubCategory", subCategorySchema);
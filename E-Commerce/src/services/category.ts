import expressAsyncHandler from "express-async-handler";
import type { ICategory } from "../Interfaces/index.js";
import { CategoryM } from "../models/category.js";

export const createCategoryServices = async(category:ICategory)=>{
    const exitCategory = await CategoryM.findOne({name:category.name});
    if(exitCategory){
        throw new Error("Category Already Exist. ")
    }
    const cat = await CategoryM.create({
        name: category.name,
        slug: category.slug,
        image: category.image
    });
    return cat;
}
export const getCategoryServices = async (skip:number,limit:number)=>{
     const categories = await CategoryM.find({}).skip(skip).limit(limit);
     const total = await CategoryM.countDocuments();
     return {categories , total};
}

export const getCategoryServicesById = async (id:string)=>{
    const category = await CategoryM.findById(id);
    if(!category){
         throw new Error("Category Not Found")
    }
    return category
}

export const updateCategoryServices = async(id:string,category:{name:string,image:string})=>{
    const cat = await CategoryM.findOneAndUpdate({_id:id},{...category},{new:true});
    return cat;
}
export const deleteCategoryServices = async(id:string)=>{
    const cat = await CategoryM.findOneAndDelete({_id:id});
    return cat;
}

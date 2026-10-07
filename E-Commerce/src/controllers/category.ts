import { createCategoryServices, getCategoryServices, getCategoryServicesById,updateCategoryServices,deleteCategoryServices } from "../services/category.js";
import  slugify  from 'slugify';

export const createCategoryController = async (req: any, res: any) => {
  const { name, image ,slug} = req.body || {};
  if(!name || !image ){
    return res.status(400).json({success:false , message :"Input Valid Data"})
  }
  const category = await createCategoryServices({ name, slug:slugify(name), image});
 return  res.status(201).json({success:true,message:"Created Success Category", data:category})
};

export const getCategoryController= async(req:any,res:any)=>{
  const {page,limit} = req.query ||{};
  const skip = (Number(page) - 1) * Number(limit);
  const {categories,total} = await getCategoryServices(skip,Number(limit));
  return res.status(200).json({success:true,message:"Get Success Category",results:total ,allPages:Math.round(total  / limit),currentPage:page,limit, data:categories})
}

export const getCategoryControllerById = async(req:any,res:any)=>{
  const {id} = req.params||""
  const category = await getCategoryServicesById(id);
  return res.status(200).json({success:true,message:"Get Success Category",data:category})
}

export const updateCategoryControllerById = async(req:any,res:any)=>{
  const {id} = req.params||"";
  const {name,image} = req.body;
  const category = await updateCategoryServices(id,{name,image});
  return res.status(200).json({success:true,message:"Update Success Category",data:category})
}
export const deleteCategoryControllerById = async(req:any,res:any)=>{
  const {id} = req.params||"";
  const category = await deleteCategoryServices(id);
  return res.status(200).json({success:true,message:"Delete Success Category",data:category})
}

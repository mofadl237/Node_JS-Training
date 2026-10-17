import { getUserServices } from "../services/users.services.js";

export const getUserController = async(req:any,res:any)=>{
    const {page , limit} = req.query
  const users = await getUserServices(page,limit);
  res.status(200).json({success:true,page ,users })


}
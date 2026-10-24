import { ILoginData, IRegisterData } from "../../interfaces/auth";

export const registerService = (data:IRegisterData)=>{
// spread Data
// const {email,password,name} = data;
// const userExisting = await prisma.user.findUnique({where:email})
// if(userExisting){
// throw new AppError('User Already Existing',400)
// }
// const hashPassword = await bcrypt.hash(password,10);
// const user = await prisma.user.create({
// data:{name,email,password:hashPassword,role:"PATIENT"} 
// //blablabla بنضيف باقي ال Data كدا كدا هتيجي من الفرونت اصلا
// },select:{id:true,name:true,email:true})
// const token = jwt.sign({id:user.id}) //شوف الحته دي من ال Ai Completed 
// return {user,token}
 
}

export const loginServices=(data:ILoginData)=>{
    // 1-parsing data 2-check email found 3-check success pass 4- return user and token 
    // const {email,password} = data;
    // const user= await prisma.user.findUnique({where:email});
    // if(!user){
    // throw new AppError("User Not Found",401);//Invalid Email Or Password ماتثقش في العميل صعبها عليها متاكدلوش ان فيه User بالايميل دا اصلا 
    // }
    // const isMatch = await bcrypt.compare(password,user.password);
    // if(!isMatch){
    // throw new AppError('Invalid Email Or Password',401)
    // }
    // const token= ai completed
    // return{user,token}

}
export const getMe = ()=>{
    
}
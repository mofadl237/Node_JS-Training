import { pool } from "../config/index.js"

export const getUserServices = async(page:string ,limit:string)=>{
    const skip = (+page - 1 ) * 1
    const {rows}   = await pool.query("SELECT * FROM users");
    return rows;
}
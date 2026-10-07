import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL||'');

    console.log(`Database Connect: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error: any) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};


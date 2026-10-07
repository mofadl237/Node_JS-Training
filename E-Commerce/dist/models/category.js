import mongoose from 'mongoose';
export const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
});
export const Category = mongoose.model("Category", categorySchema);
//# sourceMappingURL=category.js.map
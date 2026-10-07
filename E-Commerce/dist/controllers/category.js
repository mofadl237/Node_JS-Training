import { Category } from "../models/category.js";
export const createCategory = async (name) => {
    const category = await Category.create({
        name: name,
    });
    return category;
};
//# sourceMappingURL=category.js.map
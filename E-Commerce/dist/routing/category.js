const express = require("express");
export const router = express.Router();
const categoryService = require("../services/category");
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const category = await categoryService.createCategory(name);
        res.status(201).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
//# sourceMappingURL=category.js.map
import express from 'express'
import { createCategoryController ,getCategoryController, getCategoryControllerById,updateCategoryControllerById,deleteCategoryControllerById} from '../controllers/category.js';


export const router = express.Router();

router.route('/').post(createCategoryController).get(getCategoryController)
router.route('/:id').get(getCategoryControllerById).put(updateCategoryControllerById).delete(deleteCategoryControllerById);
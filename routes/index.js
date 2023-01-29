const express = require('express');
const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController')
const router = express.Router();

/* GET home page. */
router.get('/', itemController.index);

// All category-related routes
// GET main category list page
router.get('/categories', categoryController.allCategories)
// GET category page
router.get('/category/:name', categoryController.categoryDisplay)
// GET category creation page
router.get('/categories/create', categoryController.createCategory)
// POST new category data
router.post('/categories/create', categoryController.createCategoryPost)
// GET category update page
router.get('/category/:name/update', categoryController.updateCategory)
// POST category update
router.post('/category/:name/update', categoryController.updateCategoryPost)
// GET category delete page
router.get('/category/:name/delete', categoryController.deleteCategory)
// POST category deletion
router.post('/category/:name/delete', categoryController.deleteCategoryPost)

// All item-related routes
// GET main item list page
router.get('/items', itemController.allItems)
// GET item page
router.get('/item/:id', itemController.itemDisplay)
// GET item creation page
router.get('/items/create', itemController.createItem)
// POST new item data
router.post('/items/create', itemController.createItemPost)
// GET item update page
router.get('/item/:id/update', itemController.updateItem)
// POST item update
router.post('/item/:id/update', itemController.updateItemPost)
// GET item delete page
router.get('/item/:id/delete', itemController.deleteItem)
// POST item deletion
router.post('/item/:id/delete', itemController.deleteItemPost)

module.exports = router;

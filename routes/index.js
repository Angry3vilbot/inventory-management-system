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

// All item-related routes
// GET main item list page
router.get('/items', itemController.allItems)
// GET item page
router.get('/item/:id', itemController.itemDisplay)

module.exports = router;

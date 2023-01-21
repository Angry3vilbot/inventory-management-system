const express = require('express');
const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController')
const router = express.Router();

/* GET home page. */
router.get('/', itemController.index);

// All category-related routes
// GET main category list page
router.get('/categories', categoryController.allCategories)

module.exports = router;

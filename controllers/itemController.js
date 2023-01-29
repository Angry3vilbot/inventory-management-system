const ItemModel = require("../models/item.js")
const CategoryModel = require("../models/category.js")
const async = require("async")
const { default: mongoose } = require("mongoose")
const { body, validationResult } = require("express-validator")

exports.index = (req, res) => {
    async.parallel(
        {
            itemCount(callback) {
                ItemModel.countDocuments({}, callback)
            },
            categoryCount(callback) {
                CategoryModel.countDocuments({}, callback)
            },
            uncategorisedItems(callback) {
                ItemModel.countDocuments({ category: [] }, callback)
            },
            outOfStockItems(callback) {
                ItemModel.countDocuments({ stock: 0 }, callback)
            },
        },
        (err, results) => {
            res.render("index", {
                error: err,
                data: results,
            });
        }
    )
}

exports.allItems = (req, res) => {
    async.parallel(
        {
            items(callback) {
                ItemModel.find({}, callback)
            }
        },
        (err, results) => {
            console.log(results)
            res.render("all_items", {
                error: err,
                data: results,
            });
        }
    )
}

exports.itemDisplay = (req, res) => {
    console.log(req.params)
    async.parallel(
        {
            item(callback) {
                ItemModel.findById(req.params.id).exec(callback)
            }
        },
        async (err, results) => {
            console.log(results.item)
            let categoriesArray = []
            for (const i in results.item.category){
                let categ = await CategoryModel.findById(results.item.category[i])
                categoriesArray.push(categ)
            }
            res.render("item", {
                error: err,
                data: results.item,
                categories: categoriesArray,
            });
        }
    )
}

exports.createItem = (req, res) => {
    async.parallel(
        {
            categories(callback) {
                CategoryModel.find({}, callback)
            }
        },
        (err, results) => {
            console.log(results.categories)
            res.render("item_form", {
                error: err,
                categories: results.categories,
                title: "Create Item",
            })
        }
    )
}

exports.createItemPost = [
    // Validate and sanitize fields.
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),
    body("description")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Description must be specified."),
    body("price", "Invalid price")
      .isFloat({ min: 1 }),
    body("stock", "Invalid stock amount")
      .isNumeric(),
    body("category").escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("item_form", {
          title: "Create Item",
          item: req.body,
          errors: errors.array(),
        });
        return;
      }
      // Data from form is valid.
  
      // Create an Item object with escaped and trimmed data.
      console.log(req.category)
      if(req.category){
            const item = new ItemModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
        });
        item.save((err) => {
            if (err) {
              return next(err);
            }
            // Successful - redirect to new item page.
            res.redirect(item.url);
          });
      } else {
        const item = new ItemModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
      })
      item.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new item page.
        res.redirect(item.url);
      });
     }
    },
];

exports.updateItem = (req, res, next) => {
    async.parallel(
        {
            item(callback) {
                ItemModel.findById(req.params.id).exec(callback)            
            },
            categories(callback) {
                CategoryModel.find({}).exec(callback)
            }
        },
        async (err, results) => {
            if(err) {
                return next(err)
            }
            const selectedCategory = await CategoryModel.findById(results.item.category[0])
            console.log(results.item)
            res.render("item_form", {
                title: "Update Item",
                item: results.item,
                selectedCategory: selectedCategory,
                categories: results.categories
            })
        }
    )
}

exports.updateItemPost = [
    // Validate and sanitize fields.
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),
    body("description")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Description must be specified."),
    body("price", "Invalid price")
      .isFloat({ min: 1 }),
    body("stock", "Invalid stock amount")
      .isNumeric(),
    body("category").escape(),
    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            const selectedCategory = await CategoryModel.findById(req.body.category[0])
            res.render("category_form", {
                title: "Create Category",
                item: req.body,
                selectedCategory: selectedCategory,
                errors: errors.array(),
            });
            return;
        }
        // Data from form is valid.

        // Create an Item object with escaped and trimmed data.
        if(req.body.category){
            const item = new ItemModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            _id: req.body.id,
        });
        ItemModel.findByIdAndUpdate(item._id, item, (err, theitem) => {
            if (err) {
              return next(err);
            }
            console.log(theitem)
            // Successful - redirect to item page.
            res.redirect(item.url);
          });
      } else {
        const item = new ItemModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            _id: req.body.id,
        })
      ItemModel.findByIdAndUpdate(item._id, item, (err, theitem) => {
        if (err) {
          return next(err);
        }
        // Successful - redirect to item page.
        res.redirect(item.url);
      });
     }
},
];
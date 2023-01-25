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
                ItemModel.countDocuments({ category: null }, callback)
            },
            outOfStockItems(callback) {
                ItemModel.countDocuments({ stock: 0 }, callback)
            },
        },
        (err, results) => {
            console.log(results)
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
    async.parallel(
        {
            item(callback) {
                ItemModel.findById(mongoose.Types.ObjectId(req.params.id)).exec(callback)
            }
        },
        async (err, results) => {
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
  
      // Create an Author object with escaped and trimmed data.
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
        // Successful - redirect to new author record.
        res.redirect(item.url);
      });
    },
];
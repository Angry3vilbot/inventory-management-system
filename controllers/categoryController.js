const CategoryModel = require("../models/category.js")
const ItemModel = require("../models/item.js")
const async = require("async")
const { body, validationResult } = require("express-validator")
const { default: mongoose } = require("mongoose")

exports.allCategories = (req, res) => {
    async.parallel(
        {
            categories(callback) {
                CategoryModel.find({}, callback)
            }
        },
        (err, results) => {
            res.render("all_categories", {
                error: err,
                data: results,
            });
        }
    )
}

exports.categoryDisplay = (req, res) => {
    async.parallel(
        {
            category(callback) {
                CategoryModel.find({ $text: { $search: req.params.name } }).exec(callback)
            }
        },
        async function (err, results) {
            if(results.category.length > 1) {
                let correctResult = results.category.filter(obj => obj.name.toLowerCase().replace(/\s/g,'-') == req.params.name)
                const itemsArray = await ItemModel.find({ category: correctResult[0]._id })
                res.render("category", {
                    error: err,
                    category: correctResult[0],
                    itemsArray: itemsArray
                })
            }
            else{
                const itemsArray = await ItemModel.find({ category: results.category[0]._id })
                res.render("category", {
                    error: err,
                    category: results.category[0],
                    itemsArray: itemsArray
                })
            }
        }
    )
}

exports.createCategory = (req, res) => {
    res.render("category_form", {
        title: "Create Category"
    })
}

exports.createCategoryPost =  [
    // Validate and sanitize fields.
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("category_form", {
          title: "Create Category",
          category: req.body,
          errors: errors.array(),
        });
        return;
      }
      // Data from form is valid.
  
      // Create a Category object with escaped and trimmed data.
      const category = new CategoryModel({
        name: req.body.name,
      });
      category.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new category page.
        res.redirect(category.url);
      });
    },
];

exports.updateCategory = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                CategoryModel.find({ $text: { $search: req.params.name } }).exec(callback)            }
        },
        (err, results) => {
            if(err) {
                return next(err)
            }
            if(results.category.length > 1){
                let correctResult = results.category.filter(obj => obj.name.toLowerCase().replace(/\s/g,'-') == req.params.name)
                res.render("category_form", {
                    title: "Update Category",
                    category: correctResult
                })
            }
            else{
                res.render("category_form", {
                    title: "Update Category",
                    category: results.category[0]
                })
            }
        }
    )
}

exports.updateCategoryPost = [
    // Validate and sanitize fields.
    body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified."),
    // Process request after validation and sanitization.
    async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("category_form", {
                title: "Create Category",
                category: req.body,
                errors: errors.array(),
            });
            return;
        }
        // Data from form is valid.

        // Create a Category object with escaped and trimmed data.
        let categ = await CategoryModel.find({ $text: { $search: req.params.name } })
        if(categ.length > 1){
            let correctResult = categ.filter(obj => obj.name.toLowerCase().replace(/\s/g,'-') == req.params.name)
            const category = new CategoryModel({
                name: req.body.name,
                _id: correctResult.id
            });
            CategoryModel.findByIdAndUpdate(correctResult._id, category, {}, (err, thecategory) => {
                if (err) {
                  return next(err);
                }
          
                // Successful: redirect to category detail page.
                res.redirect(thecategory.url);
              });
        }
        else{
            const category = new CategoryModel({
                name: req.body.name,
                _id: categ[0].id
            });
            CategoryModel.findByIdAndUpdate(categ[0]._id, category, {}, (err, thecategory) => {
                if (err) {
                  return next(err);
                }
          
                // Successful: redirect to category detail page.
                res.redirect(`/category/${req.body.name.toLowerCase().replace(/\s/g,'-')}`);
              });
        }
},
];

exports.deleteCategory = (req, res) => {
    async.parallel(
        {
            category(callback) {
                CategoryModel.find({ $text: { $search: req.params.name } }).exec(callback)
            }
        },
        async function (err, results) {
            if(results.category.length > 1) {
                let correctResult = results.category.filter(obj => obj.name.toLowerCase().replace(/\s/g,'-') == req.params.name)
                const itemsArray = await ItemModel.find({ category: correctResult[0]._id })
                res.render("category_delete", {
                    title: `Delete Category ${correctResult[0].name}`,
                    error: err,
                    category: correctResult[0],
                    itemsArray: itemsArray
                })
            }
            else{
                const itemsArray = await ItemModel.find({ category: results.category[0]._id })
                res.render("category_delete", {
                    title: `Delete Category ${results.category[0].name}`,
                    error: err,
                    category: results.category[0],
                    itemsArray: itemsArray
                })
            }
        }
    )
}

exports.deleteCategoryPost = (req, res) => {
    async.parallel(
        {
            category(callback) {
                CategoryModel.findById(req.body.category_id).exec(callback);
            },
            items(callback) {
                ItemModel.find({ category: req.body.category_id }).exec(callback)
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            results.items.forEach(item => {
                const newitem = new ItemModel({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    stock: item.stock,
                    _id: item._id,
                })
                ItemModel.findByIdAndUpdate(item._id, newitem, (err, theitem) => {
                    if (err) {
                      return next(err);
                    }
                  });
            });
            CategoryModel.findByIdAndRemove(req.body.category_id, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/categories");
            });
        }
    );
  };
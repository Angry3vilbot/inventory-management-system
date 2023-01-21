const CategoryModel = require("../models/category.js")
const async = require("async")
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
        (err, results) => {
            if(results.category.length > 1) {
                console.log(results.category)
                let correctResult = results.category.filter(obj => obj.name.toLowerCase().replace(/\s/g,'-') == req.params.name)
                console.log(correctResult)
                res.render("category", {
                    error: err,
                    category: correctResult[0]
                })
            }
            else{
                console.log(results.category[0])
                res.render("category", {
                    error: err,
                    category: results.category[0]
                })
            }
        }
    )
}
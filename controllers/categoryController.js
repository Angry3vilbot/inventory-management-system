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
            console.log(results)
            res.render("all_categories", {
                error: err,
                data: results,
            });
        }
    )
}
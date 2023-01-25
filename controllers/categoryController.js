const CategoryModel = require("../models/category.js")
const ItemModel = require("../models/item.js")
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

}
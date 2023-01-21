const ItemModel = require("../models/item.js")
const CategoryModel = require("../models/category.js")
const async = require("async")
const { default: mongoose } = require("mongoose")

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
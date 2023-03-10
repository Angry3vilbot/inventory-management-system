const mongoose = require("mongoose")

const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: { type: String, required: true }
}, { versionKey: false })

CategorySchema.virtual("url").get(function () {
    return `/category/${this.name.toLowerCase().replace(/\s/g,'-')}`
})

module.exports = mongoose.model("Category", CategorySchema, "categories")
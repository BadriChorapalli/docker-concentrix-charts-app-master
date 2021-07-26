const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Charts = new Schema(
    {
        name: { type: String, required: true },
        time: { type: [String], required: false },
        type: { type: String, required: true },
        showChart:Boolean,
        chartData:[]

    },
    { timestamps: true },
)

module.exports = mongoose.model('charts', Charts)
const Charts = require('../models/charts-model')

createChart = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Chart',
        })
    }

    const chart = new Charts(body)

    if (!chart) {
        return res.status(400).json({ success: false, error: err })
    }

    chart
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: chart._id,
                message: 'Chart created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Chart not created!',
            })
        })
}
updateChart = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Charts.findOne({ _id: req.params.id }, (err, chart) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Chart not found!',
            })
        }
        chart.name = body.name
        chart.time = body.time
        chart.chartData = body.chartData
        chart.showChart = body.showChart
        chart
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: chart._id,
                    message: 'Chart updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Chart not updated!',
                })
            })
    })
}

getCharts = async (req, res) => {
    await Charts.find({}, (err, charts) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!charts.length) {
            return res
                .status(404)
                .json({ success: false, error: `Charts not found` })
        }
        return res.status(200).json({ success: true, data: charts })
    }).catch(err => console.log(err))
}
deleteChart = async (req, res) => {
    await Charts.findOneAndDelete({ _id: req.params.id }, (err, chart) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!chart) {
            return res
                .status(404)
                .json({ success: false, error: `Chart not found` })
        }

        return res.status(200).json({ success: true, data: chart })
    }).catch(err => console.log(err))
}
module.exports = {
    createChart,
    updateChart,
    getCharts,
    deleteChart
}

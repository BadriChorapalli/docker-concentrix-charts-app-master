const express = require('express')

const ChartsCtrl = require('../controllers/charts-ctrl')


const router = express.Router()

router.post('/chart', ChartsCtrl.createChart)
router.put('/chart/:id', ChartsCtrl.updateChart)
router.get('/charts', ChartsCtrl.getCharts)
router.delete('/chart/:id', ChartsCtrl.deleteChart)


module.exports = router

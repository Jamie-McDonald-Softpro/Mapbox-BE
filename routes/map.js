// routes/map.js
const express = require('express')
const router = express.Router()
const Map = require('../models/map')
const turf = require('turf')

/**
 * Validates if an array of points can form a valid polygon.
 * @param {Array} points - Array of points, where each point is an array of [longitude, latitude].
 * @return {boolean} - Returns true if the points can form a polygon, false otherwise.
 */
function validatePolygon(points) {
  // Check if there are at least three points
  if (points.length < 4) {
    console.log(
      'A polygon must have at least three points plus a closing point that duplicates the first point.'
    )
    return false
  }

  // Check if the first point is the same as the last point
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    console.log(
      'The first and last points must be the same to close the polygon.'
    )
    return false
  }

  // Create a line string to check for self-intersection using turf.kinks
  const line = turf.lineString(points)
  const kinks = turf.kinks(line)
  if (kinks.features.length > 0) {
    console.log('The polygon has self-intersecting points.')
    return false
  }

  return true
}
// Create a data
router.post('/', async (req, res) => {
  const polyData = new Map({
    polygonName: req.body.polygonName,
    polygonCoordinates: req.body.polygonCoordinates
  })

  try {
    if (
      !validatePolygon(
        polyData.polygonCoordinates?.[0]?.geometry?.coordinates?.[0] ?? []
      )
    ) {
      res
        .status(400)
        .json({ messageKey: 'Error', message: 'Invalid polygon data' })
      return
    }
    const newTask = await polyData.save()
    res
      .status(200)
      .send({ messageKey: 'Success', message: 'Polygon added successfully' })
  } catch (err) {
    res.status(400).json({ messageKey: 'Error', message: err.message })
  }
})

router.post('/name', async (req, res) => {
  const changeData = req.body
  try {
    changeData.forEach(async ([id, name]) => {
      try {
        await Map.updateOne({ _id: id }, { $set: { polygonName: name } })
      } catch (err) {
        console.log(err)
      }
    })
    res.status(200).send({
      messageKey: 'Success',
      message: 'Polygon name updated successfully'
    })
  } catch (err) {
    res.status(400).json({ messageKey: 'Error', message: err.message })
  }
})

// Get all polygons
router.get('/', async (req, res) => {
  try {
    const data = await Map.find()
    res.json({
      messageKey: 'Success',
      message: 'Polygons retrieved successfully',
      data: data
    })
  } catch (err) {
    res.status(500).json({ messageKey: 'Error', message: err.message })
  }
})

module.exports = router

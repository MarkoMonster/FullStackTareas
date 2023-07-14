const express = require('express');
const router = express.Router();
const {getTareas, createTareas, updateTareas, deleteTareas} = require('../controllers/tareaControllers')

const {protect} = require('../middleware/authMiddleware')

// router.get('/', getTareas)
// router.post('/', createTareas)
router.route('/').get(protect, getTareas).post(protect, createTareas)

// router.put('/:id', updateTareas)
// router.delete('/:id', deleteTareas)
router.route('/:id').delete(protect, deleteTareas).put(protect, updateTareas)


module.exports = router
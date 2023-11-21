const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getAll, add, getOne, edit, remove } = require('../controllers/employees');

// роут для получения всех сотрудников
router.get('/', auth, getAll);
// роут для получения конкретного сотрудника
router.get('/:id', auth, getOne);
// роут для создания сотрудника
router.post('/add', auth, add);
// роут для обновления сотрудника
router.put('/edit/:id', auth, edit);
// роут для удаления сотрудника
router.delete('/remove/:id', auth, remove);

module.exports = router;
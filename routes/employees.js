const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getAll, add } = require('../controllers/employees');

// роут для получения всех сотрудников
router.get('/', auth, getAll);
// роут для получения конкретного сотрудника
router.get('/:id', auth, () => console.log('one employee'));
// роут для создания сотрудника
router.post('/add', auth, add);
// роут для обновления сотрудника
router.put('/edit/:id', auth, () => console.log('update employee'));
// роут для удаления сотрудника
router.delete('/remove/:id', auth, () => console.log('delete employee'));

module.exports = router;
// контроллер работы с сотрудниками
const { prisma } = require('../prisma/prisma-client');

// получение всех сотрудников
const getAll = async (req, res) => {
	try {
		const employees = await prisma.employee.findMany();
		res.status(200).json(employees);
	} catch (error) {
		res.status(400).json({ message: 'Not found employees' });
	}
}

// добавление сотрудника
const add = async (req, res) => {
	try {
		const data = req.body;

		if (!data.firstName || !data.lastName || !data.address || !data.age) {
			return res.status(400).json({ message: 'Fill available fields' });
		}
		// костыль для преобразования age в число
		data.age = parseInt(data.age);

		const employee = await prisma.employee.create({
			data: {
				...data,
				userId: req.user.id
			}
		});

		return res.status(200).json(employee);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: 'Employee not created' });
	}
}

module.exports = {
	getAll,
	add
}
const jwt = require('jsonwebtoken');
const { prisma } = require('../prisma/prisma-client');

const auth = async (req, res, next) => {
	try {
		let token = req.headers.autohorization?.split(' ')[1];
		// расшифровка токена
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// поиск пользователя
		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id
			}
		});
		// присвоение пользователя
		req.user = user;
		// продолжение
		next();
	} catch (error) {
		res.status(401).json({
			message: 'Unauthorized user'
		});
	}
}

module.exports = {
	auth
}
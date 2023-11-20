const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
	const { login, password } = req.body;

	if (!login || !password) {
		return res.status(400).json({
			message: 'Fill available fields'
		});
	}

	const user = await prisma.user.findFirst({
		where: {
			login
		}
	});

	const isMatch = await bcrypt.compare(password, user.password);

	if (user && isMatch) {
		res.status(200).json({
			id: user.id,
			login: user.login,
			name: user.name
		})
	} else {
		res.status(401).json({
			message: 'Wrong login or password'
		})
	}
}

const register = async (req, res) => {
	const { login, password, name } = req.body;

	if (!login || !password || !name) {
		return res.status(400).json({
			message: 'Fill available fields'
		});
	}

	const registeredUser = await prisma.user.findFirst({
		where: {
			login
		}
	});

	if (registeredUser) {
		return res.status(409).json({
			message: 'User already exists'
		});
	}

	const user = await prisma.user.create({
		data: {
			login,
			password: await bcrypt.hash(password, 10),
			name
		}
	});

	const secret = process.env.JWT_SECRET;

	if (user && secret) {
		res.status(200).json({
			id: user.id,
			login: user.login,
			name: user.name,
			token: jwt.sign(
				{
					id: user.id,
				},
				secret,
				{
					expiresIn: '24h'
				}
			)
		})
	} else {
		res.status(401).json({
			message: 'User not created'
		})
	}
}

const current = async (req, res) => {
	res.send('current');
}

module.exports = {
	login,
	register,
	current
}
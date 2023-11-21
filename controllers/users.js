const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({
				message: 'Fill available fields'
			});
		}

		const user = await prisma.user.findFirst({
			where: {
				email
			}
		});

		const isMatch = await bcrypt.compare(password, user.password);
		const secret = process.env.JWT_SECRET;

		if (user && isMatch && secret) {
			res.status(200).json({
				id: user.id,
				email: user.email,
				name: user.name,
				token: jwt.sign(
					{
						id: user.id
					},
					secret,
					{
						expiresIn: '24h'
					}
				)
			})
		} else {
			res.status(401).json({
				message: 'Wrong email or password'
			})
		}
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong' });
	}
}

const register = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		if (!email || !password || !name) {
			return res.status(400).json({
				message: 'Fill available fields'
			});
		}

		const registeredUser = await prisma.user.findFirst({
			where: {
				email
			}
		});

		if (registeredUser) {
			return res.status(409).json({
				message: 'User already exists'
			});
		}

		const user = await prisma.user.create({
			data: {
				email,
				password: await bcrypt.hash(password, 10),
				name
			}
		});

		const secret = process.env.JWT_SECRET;

		if (user && secret) {
			res.status(200).json({
				id: user.id,
				email: user.email,
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
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong' });
	}
}

const current = async (req, res) => {
	return res.status(200).json(req.user);
}

module.exports = {
	login,
	register,
	current
}
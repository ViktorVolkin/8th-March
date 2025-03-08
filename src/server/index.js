import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";
import cors from "cors";

// Инициализация Express
const app = express();
app.use(express.json());
app.use(cors());

// Подключение к MongoDB
mongoose
	.connect(
		"mongodb+srv://Viktor:lAPtlKVWAqbbLYHk@1.kwnyv.mongodb.net/blog?retryWrites=true&w=majority&appName=1"
	)
	.then(() => {
		console.log("DB connected");
	})
	.catch((err) => {
		console.log(`DB ERROR:  ${err}`);
	});
app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const { fullName, username, password } = req.body;

		const existingUser = await UserModel.findOne({
			username: username,
		});
		if (existingUser) {
			return res.status(400).json({
				message: "Логин уже занят",
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			fullName,
			username: username,
			passwordHash: hash,
			role: "user",
		});
		const user = await doc.save();
		const token = jwt.sign({ _id: user._id }, "Zhanna D'ark", {
			expiresIn: "90d",
		});

		const { passwordHash, ...userData } = user._doc;
		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось зарегистрироваться, попробуйте позже.",
		});
	}
});

app.post("/auth/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await UserModel.findOne({ username });
		if (!user) {
			return res.status(404).json({
				message: "Пользователь не найден.",
			});
		}

		const isValidPassword = await bcrypt.compare(
			password,
			user.passwordHash
		);
		if (!isValidPassword) {
			return res.status(400).json({
				message: "Неверный пароль.",
			});
		}

		const token = jwt.sign(
			{ _id: user._id, role: user.role },
			"Zhanna D'ark",
			{
				expiresIn: "90d",
			}
		);
		const { passwordHash, ...userData } = user._doc;
		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось авторизоваться.",
		});
	}
});

app.get("/auth/me", checkAuth, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			return res.status(404).json({ message: "Пользователь не найден." });
		}
		const { passwordHash, ...userData } = user._doc;
		res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Что то пошло не так..." });
	}
});

app.listen(4444, (err) => {
	if (err) return console.log(err);
	console.log("Server is running on port 4444");
});

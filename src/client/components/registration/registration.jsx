import React, { useState, useEffect } from "react";
import "./registration.scss";
import "../../globalStyles.scss";
import { register } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Registration = () => {
	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);
	const navigate = useNavigate();

	// Валидация формы
	const validateForm = () => {
		if (fullName.trim() === "" || fullName.length < 3) {
			return "Имя пользователя должно содержать не менее 3 символов.";
		}
		if (
			username.trim() === "" ||
			username.length < 3 ||
			!/^[a-zA-Z0-9_]+$/.test(username)
		) {
			return "Логин должен содержать не менее 3 символов и только латинские буквы.";
		}
		if (password.trim() === "" || password.length < 5) {
			return "Пароль должен содержать не менее 5 символов.";
		}
		return "";
	};

	// Проверка валидности формы при изменении полей
	useEffect(() => {
		const validationError = validateForm();
		setError(validationError);
		setIsFormValid(!validationError);
	}, [fullName, username, password]);

	// Обработка отправки формы
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isFormValid) return;

		setError("");
		setSuccess("");

		try {
			const response = await register(fullName, username, password);
			setSuccess(
				"Регистрация прошла успешно! Перенаправляем на страницу авторизации..."
			);
			setTimeout(() => {
				navigate("/auth/login");
			}, 2000);
		} catch (err) {
			setError(err.message || "Произошла ошибка при регистрации.");
		}
	};

	return (
		<div className="registration-container">
			<h2>Регистрация</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="fullName">Имя пользователя:</label>
					<input
						type="text"
						id="fullName"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						required
						className={
							error && fullName.length < 3 ? "invalid" : ""
						}
					/>
				</div>
				<div>
					<label htmlFor="username">Логин:</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className={
							error && username.length < 3 ? "invalid" : ""
						}
					/>
				</div>
				<div>
					<label htmlFor="password">Пароль:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className={
							error && password.length < 5 ? "invalid" : ""
						}
					/>
				</div>
				<button type="submit" disabled={!isFormValid}>
					Зарегистрироваться
				</button>
			</form>
			{error && <p className="error">{error}</p>}
			{success && <p className="success">{success}</p>}
		</div>
	);
};

export default Registration;

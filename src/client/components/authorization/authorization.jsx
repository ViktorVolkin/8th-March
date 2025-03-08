import React, { useState } from "react";
import "./authorization.scss";
import { useNavigate } from "react-router-dom";
import { login, getUserDetails } from "../../api/api.js";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const validateForm = () => {
		if (username.trim() === "" || username.length < 3) {
			return "Логин должен содержать не менее 3 символов.";
		}
		if (password.trim() === "" || password.length < 5) {
			return "Пароль должен содержать не менее 5 символов.";
		}
		return "";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			return;
		}

		setError("");
		setIsLoading(true);

		try {
			const loginResponse = await login(username, password);
			localStorage.setItem("token", loginResponse.token);

			const userDetails = await getUserDetails(loginResponse.token);
			localStorage.setItem("userName", userDetails.username);
			localStorage.setItem("fullName", userDetails.fullName);
			localStorage.setItem("userRole", userDetails.role);

			if (userDetails.role === "admin") {
				navigate(`/admin/${userDetails.username}`);
			} else {
				navigate(`/user/${userDetails.username}`);
			}
		} catch (err) {
			setError(err.message || "Произошла ошибка при авторизации.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login-container">
			<h2>Авторизация</h2>
			{error && <p className="error">{error}</p>}
			<form onSubmit={handleSubmit}>
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
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Загрузка..." : "Войти"}
				</button>
			</form>
		</div>
	);
};

export default Login;

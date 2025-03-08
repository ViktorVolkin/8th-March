import React from "react";
import "./HomePage.scss";

import "../../globalStyles.scss";
import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<main className="home-page-main">
			<div className="home-page">
				<h1 className="home-page-title">
					Поздравляю вас с 8 марта, девочки!
				</h1>
				<div className="button__container">
					<Link
						to="/auth/register"
						className="home-page-button button-registration"
					>
						Регистрация
					</Link>
					<Link
						to="auth/login"
						className="home-page-button button-authorization"
					>
						Авторизация
					</Link>
				</div>
			</div>
		</main>
	);
};

export default HomePage;

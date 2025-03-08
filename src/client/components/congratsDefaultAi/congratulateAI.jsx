import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../api/api.js"; // Импортируем функцию для получения данных
import "./congratsAI.scss";

const CongratulateUser = () => {
	const { username } = useParams();
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Шаблон текста для поздравления
	const messageTemplate = (name) => `
    Дорогая ${name}, с 8 Марта! 🌸
    Пусть этот день принесет тебе море улыбок, тепла и радости! 
    Ты — уникальная, сильная и прекрасная, и мы ценим тебя за всё, что ты делаешь. 
    Пусть каждый твой день будет наполнен счастьем, вдохновением и любовью! 
    Оставайся такой же яркой и неповторимой! 💐
  `;

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = localStorage.getItem("token");
				const userDetails = await getUserDetails(token);

				// Используем шаблон для создания сообщения
				setUserData({
					name: userDetails.fullName || userDetails.username,
					message: messageTemplate(
						userDetails.fullName || userDetails.username
					),
				});
			} catch (error) {
				console.error(
					"Ошибка при получении данных пользователя:",
					error
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [username]);

	// Генерация сердечек
	const hearts = useMemo(
		() =>
			Array(15)
				.fill()
				.map((_, i) => ({
					id: i,
					x: Math.random() * 100,
					y: Math.random() * 100,
					delay: Math.random() * 2,
					duration: 3 + Math.random() * 2,
				})),
		[]
	);

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	if (!userData) {
		return <div>Пользователь не найден</div>;
	}

	return (
		<div className="user-page">
			{/* Анимированные сердечки */}
			{hearts.map((heart) => (
				<motion.div
					key={heart.id}
					className="heart"
					initial={{
						y: "-10vh",
						x: `${heart.x}vw`,
						opacity: 0,
						scale: 0.5,
					}}
					animate={{
						y: "110vh",
						x: `${heart.x + Math.random() * 10 - 5}vw`,
						opacity: [0, 1, 0],
						scale: [0.5, 1, 0.8],
					}}
					transition={{
						duration: heart.duration,
						delay: heart.delay,
						repeat: Infinity,
						ease: "linear",
					}}
					style={{
						originX: 0.5,
						originY: 0.5,
					}}
				>
					❤️
				</motion.div>
			))}

			{/* Основной контент */}
			<motion.div
				className="content"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="text-container">
					<h1>{userData.name}, с 8 Марта!</h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						{userData.message}
					</motion.p>
				</div>
			</motion.div>
		</div>
	);
};

export default CongratulateUser;

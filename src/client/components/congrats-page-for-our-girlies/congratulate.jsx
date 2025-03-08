import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../api/api.js";
import { usersData } from "./data";
import "./congrats.scss";

const CongratulatePage = () => {
	const { username } = useParams();
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = localStorage.getItem("token");
				const userDetails = await getUserDetails(token);

				if (usersData[username]) {
					setUserData({
						name: usersData[username].name,
						image: usersData[username].image,
						message: usersData[username].message,
					});
				} else {
					console.error(
						"Пользователь не найден в статических данных."
					);
				}
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
		<div className="girl-page">
			{hearts.map((heart) => (
				<motion.div
					key={heart.id}
					className="heart"
					initial={{
						y: `${-heart.y}vh`,
						x: `${heart.x}vw`,
						opacity: 0,
					}}
					animate={{
						y: "100vh",
						x: `${heart.x + Math.random() * 20 - 10}vw`,
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: heart.duration,
						delay: heart.delay,
						repeat: Infinity,
						ease: "linear",
					}}
				>
					❤️
				</motion.div>
			))}

			<motion.div
				className="content"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="image-container">
					<motion.img
						className="girl-image"
						src={userData.image}
						alt={userData.name}
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", stiffness: 100 }}
					/>
				</div>

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

export default CongratulatePage;

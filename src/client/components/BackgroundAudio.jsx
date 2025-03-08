import React, { useState, useRef, useEffect } from "react";
import Audio from "../assets/backgroundMusic.mp3";
const BackgroundAudio = () => {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
	useEffect(() => {
		const savedAudioState = localStorage.getItem("audioPlaying");
		const savedVolume = localStorage.getItem("audioVolume");

		if (savedAudioState === null) {
			localStorage.setItem("audioPlaying", "false");
		} else {
			setIsPlaying(savedAudioState === "true");
		}

		if (savedVolume === null) {
			localStorage.setItem("audioVolume", "0.5");
		} else {
			setVolume(parseFloat(savedVolume));
		}
	}, []);

	const toggleAudio = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play().catch((error) => {
					console.log(
						"Автовоспроизведение заблокировано. Пользователь должен взаимодействовать с сайтом."
					);
				});
			}
			const newState = !isPlaying;
			setIsPlaying(newState);
			localStorage.setItem("audioPlaying", newState.toString());
		}
	};
	const handleVolumeChange = (e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		localStorage.setItem("audioVolume", newVolume.toString());

		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			audioRef.current.loop = true;
			if (isPlaying) {
				audioRef.current.play().catch((error) => {
					console.log("Автовоспроизведение заблокировано.");
				});
			}
		}
	}, [isPlaying, volume]);

	return (
		<>
			<audio ref={audioRef} style={{ display: "none" }}>
				<source src={Audio} type="audio/mpeg" />
				Ваш браузер не поддерживает аудио.
			</audio>
			<div
				style={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					zIndex: 1000,
					display: "flex",
					alignItems: "center",
					gap: "10px",
					backgroundColor: "rgba(255, 255, 255, 0.8)",
					padding: "10px",
					borderRadius: "10px",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				<button
					onClick={toggleAudio}
					style={{
						padding: "10px 20px",
						backgroundColor: "#ff6b6b",
						color: "#fff",
						border: "none",
						borderRadius: "5px",
						cursor: "pointer",
						fontSize: "16px",
						transition: "background-color 0.3s ease",
					}}
					onMouseOver={(e) =>
						(e.target.style.backgroundColor = "#ff4c4c")
					}
					onMouseOut={(e) =>
						(e.target.style.backgroundColor = "#ff6b6b")
					}
				>
					{isPlaying ? "🔇 Выключить звук" : "🔊 Включить звук"}
				</button>
				<input
					type="range"
					min="0"
					max="1"
					step="0.1"
					value={volume}
					onChange={handleVolumeChange}
					style={{
						width: "100px",
						cursor: "pointer",
					}}
				/>
			</div>
		</>
	);
};

export default BackgroundAudio;

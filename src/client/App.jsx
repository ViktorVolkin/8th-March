import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Registration from "./components/registration";
import Login from "./components/authorization/authorization";
import CongratulateUser from "./components/congratsDefaultAi";
import CongratulatePage from "./components/congrats-page-for-our-girlies/congratulate";
import ProtectedRoute from "./components/ProtectedRoute";
import BackgroundAudio from "./components/BackgroundAudio";
function App() {
	return (
		<Router>
			<BackgroundAudio />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/auth/register" element={<Registration />} />
				<Route path="/auth/login" element={<Login />} />
				<Route
					path="/admin/:username"
					element={
						<ProtectedRoute>
							<CongratulatePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/user/:username"
					element={
						<ProtectedRoute>
							<CongratulateUser />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;

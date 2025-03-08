import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
	const navigate = useNavigate();
	const { username } = useParams();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const storedUserName = localStorage.getItem("userName");

		if (!token || storedUserName !== username) {
			navigate("/auth/login");
			return;
		}

		setIsLoading(false);
	}, [navigate, username, role]);

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	return children;
};

export default ProtectedRoute;

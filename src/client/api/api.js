import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:4444/auth",
	headers: {
		"Content-Type": "application/json",
	},
});

export const register = async (fullName, username, password) => {
	try {
		const response = await api.post("/register", {
			fullName,
			username,
			password,
		});
		return response.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || err.message);
	}
};

export const login = async (username, password) => {
	try {
		const response = await api.post("/login", {
			username,
			password,
		});
		return response.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || err.message);
	}
};

export const getUserDetails = async (token) => {
	try {
		const response = await api.get("/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (err) {
		throw new Error(err.response?.data?.message || err.message);
	}
};

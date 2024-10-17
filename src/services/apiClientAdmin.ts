import axios from "axios";
import { store } from "../redux/store";
import { adminLogout } from "../redux/adminSlice";

const apiClientAdmin = axios.create({
	baseURL: "https://999bookstore.online",
	headers: {
		"Content-Type": "application/json",
	},
});

apiClientAdmin.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const accessToken = state.admin.accessToken;

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

apiClientAdmin.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			store.dispatch(adminLogout());
		}
		return Promise.reject(error);
	}
);

export default apiClientAdmin;

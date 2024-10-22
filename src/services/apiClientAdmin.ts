import axios from "axios";
import { store } from "../redux/store";
import { adminLogin, adminLogout } from "../redux/adminSlice";

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
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			const state = store.getState();
			const refreshToken = state.admin.refreshToken;

			if (refreshToken) {
				try {
					const { data } = await apiClientAdmin.post("/api/admin/auth/refresh-token", {
						refreshToken,
					});
					store.dispatch(
						adminLogin({
							accessToken: data.accessToken,
							refreshToken: data.refreshToken,
						})
					);
					originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
					return apiClientAdmin(originalRequest);
				} catch (refreshError) {
					store.dispatch(adminLogout());
				}
			} else {
				console.error("No refresh token available");
			}
		}
		if (error.response && error.response.status === 401) {
			store.dispatch(adminLogout());
		}

		return Promise.reject(error);
	}
);

export default apiClientAdmin;

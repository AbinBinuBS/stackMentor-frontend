import axios from "axios";
import { store } from "../redux/store";
import { menteeLogin, menteeLogout } from "../redux/menteeSlice";

const apiClientMentee = axios.create({
	baseURL: "https://stack-mentor.vercel.app",
	headers: {
		"Content-Type": "application/json",
	},
});

apiClientMentee.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const accessToken = state.mentee.accessToken;
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

apiClientMentee.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response && error.response.status === 403) {
			const errorCode = error.response.data.code;

			if (errorCode === "ACCOUNT_INACTIVE") {
				store.dispatch(menteeLogout());
				return Promise.reject(
					new Error("Your account is inactive. Please contact support.")
				);
			} else if (errorCode === "NOT_VERIFIED") {
				return Promise.reject(
					new Error(
						"Mentee is not verified. Please complete the verification process."
					)
				);
			}
		}

		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			const state = store.getState();
			const refreshToken = state.mentee.refreshToken;

			if (refreshToken) {
				try {
					const { data } = await apiClientMentee.post("/auth/refresh-token", {
						refreshToken,
					});
					store.dispatch(
						menteeLogin({
							accessToken: data.accessToken,
							refreshToken: data.refreshToken,
						})
					);
					originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
					return apiClientMentee(originalRequest);
				} catch (refreshError) {
					store.dispatch(menteeLogout());
				}
			} else {
				console.error("No refresh token available");
			}
		}
		return Promise.reject(error);
	}
);

export default apiClientMentee;

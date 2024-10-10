import { useState, useEffect } from "react";

const useTimer = (initialTime: number) => {
	const [time, setTime] = useState<number>(initialTime);
	const [canResend, setCanResend] = useState<boolean>(false);

	useEffect(() => {
		const savedTime = localStorage.getItem("otpTimer");
		if (savedTime) {
			setTime(parseInt(savedTime, 10));
		} else {
			setTime(initialTime);
		}
	}, [initialTime]);

	useEffect(() => {
		if (time <= 0) {
			setCanResend(true);
			localStorage.removeItem("otpTimer");
			return;
		}

		const interval = setInterval(() => {
			setTime((prevTime) => {
				const newTime = prevTime - 1;
				localStorage.setItem("otpTimer", newTime.toString());
				return newTime;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [time]);

	const resetTimer = () => {
		setTime(initialTime);
		setCanResend(false);
		localStorage.removeItem("otpTimer");
	};

	return { time, canResend, resetTimer };
};

export default useTimer;

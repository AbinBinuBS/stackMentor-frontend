import React, { useState } from "react";
import { useFormik } from "formik";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import apiClient from "../../../services/apiClient";
import { LOCALHOST_URL } from "../../../constants/constants";
import axios from "axios";
import { timeSheduleValidation } from "../../../validations/mentorValidation";



const MentorSheduleTimeBody: React.FC = () => {
    const [customDates, setCustomDates] = useState<Date[]>([]);

    const formik = useFormik({
        initialValues: {
            scheduleType: 'normal' as 'normal' | 'weekly' | 'custom',
            date: null as Date | null,
            startTime: "",
            endTime: "",
            price: "",
            daysOfWeek: [] as number[],
            startDate: null as Date | null,
            endDate: null as Date | null,
        },
        validationSchema: timeSheduleValidation,
        onSubmit: async (values, { resetForm }) => {
            try {
                const baseScheduleData = {
                    startTime: moment(values.startTime, "HH:mm").format("HH:mm"),
                    endTime: moment(values.endTime, "HH:mm").format("HH:mm"),
                    price: Number(values.price),
                    scheduleType: values.scheduleType,
                };

                let scheduleData;

                switch (values.scheduleType) {
                    case "normal":
                        scheduleData = {
                            ...baseScheduleData,
                            date: moment(values.date).format("YYYY-MM-DD"),
                        };
                        break;
                    case "weekly":
                        scheduleData = {
                            ...baseScheduleData,
                            daysOfWeek: values.daysOfWeek,
                            startDate: moment(values.startDate).format("YYYY-MM-DD"),
                            endDate: moment(values.endDate).format("YYYY-MM-DD"),
                        };
                        break;
                    case "custom":
                        scheduleData = {
                            ...baseScheduleData,
                            customDates: JSON.stringify(customDates.map(date => moment(date).format("YYYY-MM-DD"))),
                        };
                        break;
                    default:
                        throw new Error("Invalid schedule type");
                }

                console.log("Sending schedule data:", scheduleData);

                const response = await apiClient.post(`${LOCALHOST_URL}/api/mentor/scheduleTime`, scheduleData);
                
                if (response.data.message === "Time scheduled successfully.") {
                    toast.success("Time scheduled successfully.");
                    resetForm();
                    setCustomDates([]);
                } else {

                    toast.error(response.data.message || "An unexpected error has occurred.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.data && error.response.data.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("An error occurred while processing your request.");
                    }
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("An unexpected error has occurred. Please try again.");
                }
            }
        },
    });

    const handleCustomDateChange = (date: Date | null) => {
        if (date && moment(date).isSameOrAfter(moment().add(1, 'days').startOf('day'))) {
            setCustomDates((prev) => {
                if (!prev.some(d => moment(d).isSame(date, "day"))) {
                    return [...prev, date];
                }
                return prev;
            });
        } else {
            toast.error("Please select a date from tomorrow onwards.");
        }
    };

    const handleRemoveDate = (dateToRemove: Date) => {
        setCustomDates(customDates.filter(date => !moment(date).isSame(dateToRemove, "day")));
    };

    return (
        <div className="container mx-auto my-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-center mb-4">Schedule Date and Time</h2>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Type</label>
                        <select
                            name="scheduleType"
                            value={formik.values.scheduleType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                            <option value="normal">Normal</option>
                            <option value="weekly">Weekly Recurrence</option>
                            <option value="custom">Custom Dates</option>
                        </select>
                        {formik.touched.scheduleType && formik.errors.scheduleType && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.scheduleType}</div>
                        )}
                    </div>

                    {formik.values.scheduleType === "normal" && (
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <DatePicker
                                selected={formik.values.date}
                                onChange={(date) => formik.setFieldValue("date", date)}
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                dateFormat="yyyy-MM-dd"
                                minDate={moment().add(1, 'days').toDate()}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.date}</div>
                            )}
                        </div>
                    )}

                    {formik.values.scheduleType === "weekly" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Days of Week</label>
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                                    <label key={day} className="inline-flex items-center mr-4">
                                        <input
                                            type="checkbox"
                                            name="daysOfWeek"
                                            value={index}
                                            checked={formik.values.daysOfWeek.includes(index)}
                                            onChange={() => {
                                                const updatedDays = formik.values.daysOfWeek.includes(index)
                                                    ? formik.values.daysOfWeek.filter(d => d !== index)
                                                    : [...formik.values.daysOfWeek, index];
                                                formik.setFieldValue('daysOfWeek', updatedDays);
                                            }}
                                            className="form-checkbox h-4 w-4 text-purple-600"
                                        />
                                        <span className="ml-2 text-sm">{day}</span>
                                    </label>
                                ))}
                                {formik.touched.daysOfWeek && formik.errors.daysOfWeek && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.daysOfWeek}</div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <DatePicker
                                    selected={formik.values.startDate}
                                    onChange={(date) => formik.setFieldValue("startDate", date)}
                                    className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    dateFormat="yyyy-MM-dd"
                                    minDate={moment().add(1, 'days').toDate()}
                                />
                                {formik.touched.startDate && formik.errors.startDate && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.startDate}</div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <DatePicker
                                    selected={formik.values.endDate}
                                    onChange={(date) => formik.setFieldValue("endDate", date)}
                                    className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    dateFormat="yyyy-MM-dd"
                                    minDate={formik.values.startDate || moment().add(1, 'days').toDate()}
                                />
                                {formik.touched.endDate && formik.errors.endDate && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.endDate}</div>
                                )}
                            </div>
                        </>
                    )}

                    {formik.values.scheduleType === "custom" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Custom Dates</label>
                            <DatePicker
                                selected={null}
                                onChange={handleCustomDateChange}
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                                dateFormat="yyyy-MM-dd"
                                minDate={moment().add(1, 'days').toDate()}
                            />
                            <div className="mt-2">
                                <span className="text-sm font-medium">Selected Dates:</span>
                                <ul className="list-disc pl-5">
                                    {customDates.map((date, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            <span>{moment(date).format("YYYY-MM-DD")}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDate(date)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                id="startTime"
                                {...formik.getFieldProps("startTime")}
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            {formik.touched.startTime && formik.errors.startTime && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.startTime}</div>
                            )}
                        </div>

                        <div className="flex-1">
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                id="endTime"
                                {...formik.getFieldProps("endTime")}
                                className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            {formik.touched.endTime && formik.errors.endTime && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.endTime}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            id="price"
                            {...formik.getFieldProps("price")}
                            className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        {formik.touched.price && formik.errors.price && (
                            <div className="text-red-500 text-xs mt-1">{formik.errors.price}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    >
                        Schedule Time
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MentorSheduleTimeBody;
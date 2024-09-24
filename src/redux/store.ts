import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import menteeReducer from './menteeSlice';
import adminReducer from './adminSlice';
import mentorReducer from './mentorSlice';
import chatReducer from './chatSlice'; 

const rootReducer = combineReducers({
  mentee: menteeReducer,
  admin: adminReducer,
  mentor: mentorReducer,
  chat: chatReducer, 
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

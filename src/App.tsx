import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MenteeRoutes from './routes/menteeRoutes';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import AdminRoutes from './routes/adminRoutes';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from "react-hot-toast";
import MentorRoutes from './routes/mentorRoutes';

const App: React.FC = () => {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Toaster position="top-center" />
            <Routes>
                <Route path="/*" element={<MenteeRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path='/mentor/*' element={<MentorRoutes/>} />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
  );
}

export default App;

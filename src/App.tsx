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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const secretKet = "pk_test_51PsJJHJd4iIFhMZI8Iua0AejtZoUfaTZHE2nhu9vc5iHha5U6pJQ9m2HIK2P8syRakM7T92qvGEe0ll87Q6yGhZG00DtYtfKd1"
const stripePromise = loadStripe(secretKet);
const App: React.FC = () => {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Toaster position="top-center" />
            <Elements stripe={stripePromise}>
            <Routes>
                <Route path="/*" element={<MenteeRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path='/mentor/*' element={<MentorRoutes/>} />
            </Routes>
            </Elements>
          </BrowserRouter>
        </PersistGate>
      </Provider>
  );
}

export default App;

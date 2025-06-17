import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Orders from './pages/Orders.jsx';
import Products from './pages/Products.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { store, persistor } from './store/index.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ProtectedRoute from './guard/ProtectedRoute.jsx';
import { ToastContainer } from 'react-toastify';
import AllProduct from './pages/AllProduct.jsx';
import DrafProduct from './pages/DrafProduct.jsx';
import LowProducts from './pages/LowProducts.jsx';
import Analytics from './pages/Analytics.jsx';
import Reviews from './pages/Reviews.jsx';
import CreateShops from './pages/CreateShops.jsx';
import ShopDetail from './pages/ShopDetail.jsx';
import ModalCreateShops from './pages/ModalCreateShops.jsx';
import AllShops from './pages/AllShops.jsx';
import CreateProduct from './pages/CreateProduct.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["admin", "seller"]}>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/404', element: <NotFound /> },
      { path: '/orders', element: <Orders /> },
      { path: '/products', element: <Products /> },
      { path: '/profile', element: <Profile /> },
      { path: '/allproduct', element: <AllProduct /> },
      { path: '/drafproduct', element: <DrafProduct /> },
      { path: '/lowproduct', element: <LowProducts /> },
      { path: '/analytics', element: <Analytics /> },
      { path: '/reviews', element: <Reviews /> },
      { path: '/createshop', element: <CreateShops /> },
      { path: '/shopdetail/:id', element: <ShopDetail /> },
      { path: '/modalcreateshops', element: <ModalCreateShops /> },
      { path: '/allshops', element: <AllShops /> },
      { path: '/createProduct', element: <CreateProduct />}
      ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>
);

import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import Sidebar from "./layouts/Sidebar";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const App = () => {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 h-[100vh]">
      <ToastContainer />
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-9 overflow-y-scroll h-[100vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

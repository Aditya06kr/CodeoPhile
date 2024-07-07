import "./App.css";
import { Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import Dashboard from "./pages/Dashboard";
import axios from "axios";

const apiUrl=import.meta.env.VITE_KEY;

function App() {
  axios.defaults.baseURL=`${apiUrl}`;
  axios.defaults.withCredentials = true;
  
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard/>} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;

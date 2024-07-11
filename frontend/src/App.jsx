import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import Clan from "./pages/ClanPage";
import ProfilePage from "./pages/ProfilePage";
import PageNotFound from "./pages/PageNotFound";

const apiUrl = import.meta.env.VITE_KEY;

function App() {
  axios.defaults.baseURL = `${apiUrl}`;
  axios.defaults.withCredentials = true;

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clan" element={<Clan />} />
            <Route path="/profile/:username" element={<ProfilePage/>} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;

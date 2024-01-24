import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import PageNotFound from "./pages/PageNotFound";
import { useEffect, useState } from "react";
import { decodeToken } from "./utils/jwtUtils";

export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token !== null) {
      navigate("/home");
    }
    // eslint-disable-next-line
  }, [token]);

  const isAuthenticated = () => {
    if (token) console.log(decodeToken(token));
    return !!localStorage.getItem("token");
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home/*"
          element={
            isAuthenticated() ? (
              <Home decodedToken={decodeToken(token)} />
            ) : (
              <Navigate to="/error-page" replace />
            )
          }
        />
        <Route path="/error-page" element={<ErrorPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

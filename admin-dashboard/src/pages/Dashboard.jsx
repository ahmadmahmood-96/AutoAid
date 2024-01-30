import { Button } from "antd";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <h1>Dashboard</h1>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}

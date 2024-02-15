import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AddProduct from "../pages/AddProduct";
import ViewProduct from "../pages/ViewProduct";
import UserDetails from "../pages/UserDetails";
import PageNotFound from "../pages/PageNotFound";

const HomeRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Dashboard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="view-product" element={<ViewProduct />} />
        <Route path="user-details" element={<UserDetails />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default HomeRoutes;

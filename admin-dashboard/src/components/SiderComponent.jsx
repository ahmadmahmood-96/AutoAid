import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  AppstoreOutlined,
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";

const SiderComponent = () => {
  const navigate = useNavigate();

  const onClick = ({ key }) => {
    if (key === "logout") {
      localStorage.clear();
      navigate("/");
    } else {
      navigate(key);
    }
  };

  return (
    <Menu
      onClick={onClick}
      style={{
        width: "100%",
        backgroundColor: "#DDF2FD",
      }}
      defaultOpenKeys={["sub1"]}
      selectedKeys={[window.location.pathname]}
      mode="inline"
      items={items}
    />
  );
};

const items = [
  { key: "/home", label: "Dashboard", icon: <HomeOutlined /> },
  {
    key: "sub1",
    label: "Products",
    icon: <AppstoreOutlined />,
    children: [
      { key: "/home/add-product", label: "Add Products" },
      { key: "/home/view-product", label: "View Products" },
    ],
  },
  { key: "/home/user-details", label: "User Details", icon: <UserOutlined /> },
  {
    key: "/home/order-details",
    label: "Order Details",
    icon: <ShopOutlined />,
  },
  { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
];

export default SiderComponent;

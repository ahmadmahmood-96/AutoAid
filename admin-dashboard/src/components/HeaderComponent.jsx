import React, { useEffect, useState } from "react";
import { Image, Space, Avatar, Typography, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtUtils";

const HeaderComponent = ({ collapsed, handleToggle }) => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const { name } = decodeToken(localStorage.getItem("token"));
      setName(name);
    }
  });
  const [name, setName] = useState("");
  const navigate = useNavigate();
  return (
    <header style={headerStyle}>
      <Space size="large">
        <Tooltip title="Click to toggle the Sidebar" color="black">
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: 28, color: "#fbfbfb" }}
              onClick={handleToggle}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: 28, color: "#fbfbfb" }}
              onClick={handleToggle}
            />
          )}
        </Tooltip>
        <Image
          src="/AutoAidLogo.png"
          alt="AutoAid Logo"
          preview={false}
          width={120}
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", filter: "invert(100%)" }}
        />
        <Typography.Text
          style={{ fontSize: 22, fontWeight: "normal", color: "#fbfbfb" }}
        >
          AutoAid Dashboard
        </Typography.Text>
      </Space>
      <Space size="large">
        <Avatar
          size={{
            xs: 20,
            sm: 25,
            md: 30,
            lg: 35,
            xl: 38,
            xxl: 45,
          }}
          shape="square"
          icon={<UserOutlined style={{ fontSize: 26 }} />}
        />
        <Typography.Text
          style={{ fontSize: 18, fontWeight: "normal", color: "#fbfbfb" }}
        >
          {name}
        </Typography.Text>
      </Space>
    </header>
  );
};

const headerStyle = {
  color: "#fff",
  height: 55,
  backgroundColor: "#164863",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
};

export default HeaderComponent;

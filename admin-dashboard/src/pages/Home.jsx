import React, { useEffect, useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Typography, Space, Avatar, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

export default function Home({ decodedToken }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "AutoAid - Home";
  }, []);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
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
                xl: 40,
                xxl: 45,
              }}
              shape="square"
              icon={<UserOutlined style={{ fontSize: 28 }} />}
            />
            <Typography.Text
              style={{ fontSize: 22, fontWeight: "normal", color: "#fbfbfb" }}
            >
              {decodedToken ? decodedToken.name : "John Doe"}
            </Typography.Text>
          </Space>
        </Header>
        <Layout>
          <Sider
            width="16%"
            style={siderStyle}
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
          >
            Sider
          </Sider>
          <Content style={contentStyle}>
            <h1>Home</h1>
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Content>
        </Layout>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </>
  );
}

const headerStyle = {
  color: "#fff",
  height: 55,
  backgroundColor: "#2b5587",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
};

const contentStyle = {
  backgroundColor: "#f7f7f7",
  padding: 10,
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#1677ff",
  height: "calc(100vh - 110px)", // Adjusted height to fill the remaining space
  // height: "80vh", // Adjusted height to fill the remaining space
};

const footerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "sticky",
  bottom: "0px",
  height: 55,
  width: "100vw",
  color: "#fff",
  backgroundColor: "#b9b9b9",
};

const layoutStyle = {
  overflow: "hidden",
  width: "100vw",
};

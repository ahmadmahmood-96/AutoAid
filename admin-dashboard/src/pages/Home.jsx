import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import HeaderComponent from "../components/HeaderComponent";
import SiderComponent from "../components/SiderComponent";
import FooterComponent from "../components/FooterComponent";
import HomeRoutes from "../routes/HomeRoutes";
import ErrorPage from "./ErrorPage";

const { Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const isAuthenticated = () => {
    console.log(!!localStorage.getItem("token"));
    return !!localStorage.getItem("token"); // Return true if token exists
  };

  useEffect(() => {
    document.title = "AutoAid - Home";
  }, []);

  return isAuthenticated() ? (
    <>
      <Layout style={layoutStyle}>
        <HeaderComponent collapsed={collapsed} handleToggle={handleToggle} />
        <Layout>
          <Sider
            width="16%"
            style={siderStyle}
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
          >
            <SiderComponent />
          </Sider>
          <Content style={contentStyle}>
            <HomeRoutes />
          </Content>
        </Layout>
        <FooterComponent />
      </Layout>
    </>
  ) : (
    <ErrorPage />
  );
};

const layoutStyle = {
  overflow: "hidden",
  width: "100vw",
};

const contentStyle = {
  backgroundColor: "#f7f7f7",
  padding: 10,
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#DDF2FD",
  height: "calc(100vh - 110px)", // Adjusted height to fill the remaining space
};

export default Home;

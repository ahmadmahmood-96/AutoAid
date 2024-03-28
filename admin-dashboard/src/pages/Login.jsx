import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Flex,
  Row,
  Col,
  message,
  Image,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "AutoAid - Login";
    if (localStorage.getItem("token")) navigate("/home");
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${baseUrl}auth/login`, values);
      console.log(response.data);
      if (response.status === 200 && response.data.role === "Admin") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        message.success(response.data.message);
        setEmail("");
        setPassword("");

        // Navigate to the home page after successful login
        navigate("/home", { replace: true });
      } else if (response.data.role !== "Admin") {
        message.error(response.data.message);
      }
    } catch (e) {
      // Handle login errors
      if (e.response && e.response.data && e.response.data.message) {
        message.error(e.response.data.message);
      } else if (!axios.isCancel(e)) {
        message.error("Failed to log in. Please try again");
      }
    }
  };

  const validateEmail = (rule, value) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email address");
    }
    return Promise.resolve();
  };

  return (
    <Row
      align="middle"
      justify="center"
      style={{ height: "100vh", margin: 0, padding: 0 }}
    >
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 12, order: 2 }}
        lg={{ span: 12, order: 2 }}
        xl={{ span: 12, order: 2 }}
        style={{ margin: 0, padding: 0 }}
      >
        <Flex
          gap="middle"
          vertical
          style={{
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <Typography.Title level={2}>Login</Typography.Title>
          <Form
            layout="vertical"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  validator: validateEmail,
                },
              ]}
            >
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Typography.Link
              href="/forgot-password"
              style={{
                color: "#008b0e",
              }}
            >
              Forgot Password?
            </Typography.Link>

            <Form.Item
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
              style={{ paddingTop: 20 }}
            >
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24, order: 2 }}
        lg={{ span: 12, order: 1 }}
        xl={{ span: 12, order: 1 }}
        style={{
          backgroundColor: "#00BE00",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%", // Set 50% height for screens smaller than md
          margin: 0,
        }}
      >
        <Flex vertical gap="middle" align="center">
          <Image src="AutoAidLogo.png" alt="AutoAid Logo" preview={false} />
          <Typography.Title
            level={2}
            style={{ fontWeight: "bold", textAlign: "center" }}
          >
            Welcome to AutoAid Admin Dashboard
          </Typography.Title>
        </Flex>
      </Col>
    </Row>
  );
}

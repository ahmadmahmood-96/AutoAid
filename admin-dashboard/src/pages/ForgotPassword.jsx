import { Typography, Form, Input, Button, Card, Row, Col, message } from "antd";
import { useState } from "react";
import OTPVerificationModal from "../components/OTPVerificationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [OTP, setOtp] = useState(0);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (values) => {
    try {
      const response = await axios.post(`${baseUrl}auth/verify-email`, values);
      if (response.status === 201) {
        message.success(response.data.message);
        setOtp(response.data.otp);
        setOtpModalVisible(true);
      } else message.error(response.data.message);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleOtpModalCancel = () => {
    setOtpModalVisible(false);
  };

  const verifyOtp = async (otp) => {
    const otpNumber = parseInt(otp, 10);
    if (OTP === otpNumber) {
      setShowForm(true);
    } else message.error("Wrong OTP entered");
    setOtpModalVisible(false);
  };

  const validateEmail = (rule, value) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email address");
    }
    return Promise.resolve();
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(`${baseUrl}auth/change-password`, {
        email,
        password,
      });
      if (response.status === 201) {
        message.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <>
      <Row align="middle" justify="center">
        <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography.Title level={2} style={{ textAlign: "center" }}>
            Forgot Password
          </Typography.Title>
        </Col>

        <Col
          span={6}
          xs={24}
          sm={12}
          md={8}
          lg={8}
          xl={6}
          style={{ marginTop: 60 }}
        >
          {!showForm && (
            <Card bordered={false} style={{ backgroundColor: "#f7f7f7" }}>
              <Form onFinish={handleForgotPassword} layout="vertical">
                <Form.Item
                  name="email"
                  label="Enter your email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email!",
                    },
                    {
                      validator: validateEmail,
                    },
                  ]}
                >
                  <Input
                    placeholder="abc@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginTop: 15 }}
                  >
                    Send OTP
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
          {showForm && (
            <Card bordered={false} style={{ backgroundColor: "#f7f7f7" }}>
              <Form onFinish={handleChangePassword} layout="vertical">
                <Form.Item
                  name="password"
                  label="Enter your new password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Re-Enter your password"
                  rules={[
                    {
                      required: true,
                      message: "Please re-enter your new password!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Re-enter new Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    offset: 7,
                    span: 16,
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginTop: 15 }}
                  >
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
      <OTPVerificationModal
        isVisible={otpModalVisible}
        onConfirm={(otp) => verifyOtp(otp)}
        onCancel={handleOtpModalCancel}
        email={email}
      />
    </>
  );
}

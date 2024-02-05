import React, { useState, createRef } from "react";
import { Modal, Typography, Input, Button, Row, Col, message } from "antd";

const OTPVerificationModal = ({ isVisible, onConfirm, onCancel, email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = Array(6)
    .fill()
    .map(() => createRef());

  const handleOTPInput = (e, index) => {
    const text = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if text is not empty
    if (text && index < otp.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleVerify = () => {
    // Check if all OTP fields are filled
    if (otp.some((digit) => digit.trim() === "")) {
      message.error("Incomplete OTP, Please fill out all fields.");
      return;
    }
    // Here, send the OTP back to the parent component for verification
    onConfirm(otp.join(""));
    setOtp(new Array(6).fill(""));
  };

  return (
    <Modal
      title="Verify Your Account"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        {email}
      </Typography.Title>
      <Typography.Paragraph>
        We have sent you a 6-digit verification code to your email. Please enter
        the code.
      </Typography.Paragraph>
      <Row gutter={[10, 0]} justify="center">
        {otp.map((digit, index) => (
          <Col key={index} span={4}>
            <Input
              ref={inputRefs[index]}
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: 18,
                height: 60,
              }}
              maxLength={1}
              type="number"
              value={digit}
              onChange={(e) => handleOTPInput(e, index)}
            />
          </Col>
        ))}
      </Row>
      <Button
        type="primary"
        onClick={handleVerify}
        style={{ marginTop: 30, width: "100%" }}
      >
        Verify
      </Button>
    </Modal>
  );
};

export default OTPVerificationModal;

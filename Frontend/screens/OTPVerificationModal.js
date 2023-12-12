// OTPVerificationModal.js
import React, { useState, createRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";

const OTPVerificationModal = ({ isVisible, onConfirm, onCancel, email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = Array(6)
    .fill()
    .map(() => createRef());

  const handleOTPInput = (text, index) => {
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
      Alert.alert("Incomplete OTP", "Please fill out all fields.");
      return;
    }
    // Here, send the OTP back to the parent component for verification
    onConfirm(otp.join(""));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Verify Your Account</Text>
            <Text style={styles.modalSubtitle}>{email}</Text>
            <Text style={styles.modalText}>
              We have sent you a 6-digit verification code to your email. Please
              enter the code.
            </Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="numeric"
                  onChangeText={(text) => handleOTPInput(text, index)}
                  value={digit}
                  autoFocus={index === 0}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  modalSubtitle: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    color: "#555",
  },
  modalText: {
    marginBottom: 30,
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    marginRight: 5,
  },
  verifyButton: {
    marginTop: 10,
    backgroundColor: "#00BE00",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  verifyButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OTPVerificationModal;

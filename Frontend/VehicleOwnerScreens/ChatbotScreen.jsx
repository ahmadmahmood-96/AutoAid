import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const baseUrl = process.env.BASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = async () => {
    if (inputText.trim() !== "") {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      };

      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Welcome! I'm the Autoaid chatbot, here to assist you on your journey by providing guidance and solutions to issues related to your car. Whether it's troubleshooting problems, offering maintenance tips, or providing advice on road safety, I'm here to help you navigate smoothly through any challenges you encounter on the road.",
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      };

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          requestBody,
          { headers }
        );
        const botResponse = response.data.choices[0].message.content;
        addMessage(botResponse, "bot");
      } catch (error) {
        console.error("Error sending message:", error);
      }

      addMessage(inputText, "user");
      setInputText("");
    }
  };

  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { _id: Math.random().toString(), text, sender },
    ]);
  };

  return (
    <>
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.messagesContainer}
            ref={scrollViewRef}
            onContentSizeChange={scrollToBottom}
          >
            {messages.map((message) => (
              <View
                key={message._id}
                style={[
                  styles.message,
                  message.sender === "user"
                    ? styles.userMessage
                    : styles.botMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={inputText}
              onChangeText={(text) => setInputText(text)}
              onSubmitEditing={handleSend}
            />
            <Ionicons
              name="send"
              size={24}
              color="#00BE00"
              onPress={handleSend}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      {/* </KeyboardAvoidingView> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    maxWidth: "70%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#00BE00",
    color: "#fff",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ddd",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
});

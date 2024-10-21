import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const chatbotResponses = {
  "What is the leave request process?":
    "You can submit a leave request through the requests section. Your Manager will review it.",
  "How do I download documents?":
    "Documents can be downloaded from your request history after they are approved.",
  "What is the working hours?": "Our working hours are from 9 AM to 5 PM.",
  "How can I contact HR?":
    "You can reach HR at sts.administration@avocarbon.com.",
  "What is your name?": "I am your friendly chatbot!",
  "Tell me a joke.":
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
};

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setIsTyping(true);

      // Simulate bot response delay
      setTimeout(() => {
        const botMessage = {
          text:
            chatbotResponses[input] || "I'm sorry, I don't understand that.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsTyping(false);
      }, 1000); // 1 second delay for typing indicator
    }
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Box
      sx={{
        width: "300px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        display: isOpen ? "block" : "none",
        zIndex: 1000,
      }}
    >
      <Typography variant="h6">Chatbot</Typography>
      <Button
        variant="outlined"
        onClick={() => setIsOpen(!isOpen)}
        sx={{ mb: 2 }}
      >
        {isOpen ? "Close" : "Open"} Chat
      </Button>
      <Button variant="outlined" onClick={handleClearChat} sx={{ mb: 2 }}>
        Clear Chat
      </Button>
      <Box
        sx={{ maxHeight: "200px", overflowY: "scroll", marginBottom: "10px" }}
      >
        {messages.map((msg, index) => (
          <Typography
            key={index}
            align={msg.sender === "user" ? "right" : "left"}
            sx={{
              backgroundColor: msg.sender === "user" ? "#d1e7dd" : "#f8d7da",
              borderRadius: "8px",
              padding: "5px",
              margin: "5px 0",
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "Bot"}: </strong>
            {msg.text}
          </Typography>
        ))}
        {isTyping && (
          <Typography
            align="left"
            sx={{
              backgroundColor: "#f8d7da",
              borderRadius: "8px",
              padding: "5px",
              margin: "5px 0",
            }}
          >
            <strong>Bot: </strong>Typing...
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <Button variant="contained" onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
};

export default Chatbot;

import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Button,
  Text,
  Avatar,
  Loader,
  Stack,
  Group,
  Paper,
  ScrollArea,
  Box,
} from '@mantine/core';
import { ArrowRight } from '@mui/icons-material';
import { generateResponse } from '../services/huggingface';
import { saveMessage, getRecentMessages, ChatMessage } from '../services/chat';

const styles = {
  root: {
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: 'var(--mantine-spacing-md)',
  },
  message: {
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: 'var(--mantine-color-blue-6)',
    color: 'var(--mantine-color-white)',
  },
  botMessage: {
    backgroundColor: 'var(--mantine-color-gray-1)',
    color: 'var(--mantine-color-black)',
  },
  inputContainer: {
    display: 'flex',
    gap: 'var(--mantine-spacing-xs)',
  },
  input: {
    flex: 1,
  },
} as const;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const recentMessages = await getRecentMessages();
        if (recentMessages.length === 0) {
          const welcomeMessage: ChatMessage = {
            text: "Hello! I'm Professor Suresh, your AI entomology expert. Feel free to ask me anything about insects!",
            sender: 'bot',
            timestamp: new Date(),
          };
          await saveMessage(welcomeMessage);
          setMessages([welcomeMessage]);
        } else {
          setMessages(recentMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    loadMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      await saveMessage(userMessage);
      const response = await generateResponse(inputMessage);
      
      const botMessage: ChatMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      await saveMessage(botMessage);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      await saveMessage(errorMessage);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isInitializing) {
    return (
      <Box style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size="lg" />
      </Box>
    );
  }

  return (
    <Paper shadow="sm" p="md" style={styles.root}>
      <Box style={styles.messageContainer}>
        {messages.map((message, index) => (
          <Group key={index} align="flex-start" justify={message.sender === 'user' ? 'flex-end' : 'flex-start'} mb="md">
            {message.sender === 'bot' && (
              <Avatar radius="xl" color="blue">Suresh</Avatar>
            )}
            <Paper
              p="sm"
              radius="md"
              style={{
                ...styles.message,
                ...(message.sender === 'user' ? styles.userMessage : styles.botMessage)
              }}
            >
              <Text size="sm">
                {message.text}
              </Text>
            </Paper>
            {message.sender === 'user' && (
              <Avatar radius="xl" color="gray">You</Avatar>
            )}
          </Group>
        ))}
      </Box>
      <div style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about insects..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading}
          rightSection={isLoading ? <Loader size="xs" /> : <ArrowRight sx={{ fontSize: 16 }} />}
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </div>
    </Paper>
  );
};

export default ChatInterface;
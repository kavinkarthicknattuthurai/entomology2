import React from 'react';
import { MantineProvider, Container, Title, Text, Box } from '@mantine/core';
import ChatInterface from './components/ChatInterface';

const styles = {
  wrapper: {
    backgroundColor: 'var(--mantine-color-gray-0)',
    minHeight: '100vh',
    padding: '2rem 0',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'calc(var(--mantine-spacing-xl) * 2)',
  }
} as const;

function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
      }}
    >
      <Box style={styles.wrapper}>
        <Container size="md">
          <Box style={styles.header}>
            <Title order={1}>Professor Suresh</Title>
            <Text color="dimmed" size="lg">Your AI Entomology Expert</Text>
          </Box>
          <ChatInterface />
        </Container>
      </Box>
    </MantineProvider>
  );
}

export default App;

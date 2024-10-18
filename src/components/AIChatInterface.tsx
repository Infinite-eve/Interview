import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, Typography } from '@mui/material';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface AIChatInterfaceProps {
  selectedQuestion?: string;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ selectedQuestion }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (selectedQuestion) {
      handleSend(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isUser: true,
    };
    setMessages([...messages, newMessage]);
    setInput('');
    // 这里应该调用AI服务来获取回复
    // 暂时用模拟的回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `AI回复: ${text}`,
        isUser: false,
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {messages.map((message) => (
          <ListItem key={message.id} sx={{ justifyContent: message.isUser ? 'flex-end' : 'flex-start' }}>
            <Typography
              sx={{
                bgcolor: message.isUser ? 'primary.main' : 'secondary.main',
                color: 'white',
                p: 1,
                borderRadius: 1,
              }}
            >
              {message.text}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', p: 1 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
        />
        <Button onClick={() => handleSend(input)}>发送</Button>
      </Box>
    </Box>
  );
};

export default AIChatInterface;

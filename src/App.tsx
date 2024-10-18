import React, { useState } from 'react';
import { Box, Grid, List, ListItem, ListItemText } from '@mui/material';
import AIChatInterface from './components/AIChatInterface';

const App: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | undefined>();

  // 模拟的面试问题列表
  const interviewQuestions = [
    "请介绍一下你自己",
    "你为什么选择我们公司？",
    "你的优势是什么？",
    "你对这个职位的理解是什么？",
  ];

  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3}>
          <List>
            {interviewQuestions.map((question, index) => (
              <ListItem
                component="button"
                key={index}
                onClick={() => setSelectedQuestion(question)}
              > 
                <ListItemText primary={question} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          <AIChatInterface selectedQuestion={selectedQuestion} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;

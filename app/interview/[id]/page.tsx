'use client';

// 本页面为模拟页面，实际使用时需要调用AI API 展示选中list中的问题和AI回答

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback, FormEvent } from 'react';
import { ArrowLeft, Send } from 'react-feather'; // 导入Send图标

interface QA {
  id: number;
  question: string;
  answer: string;
}

interface Interview {
  id: number;
  title: string;
  date: string;
  qaList: QA[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
}

export default function InterviewDetail() {
  const params = useParams();
  const { id } = params;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // 模拟从API获取面试数据
    const fetchInterview = async () => {
      // 这里应该是一个实际的API调用
      const mockInterview: Interview = {
        id: Number(id),
        title: `面试 ${id}`,
        date: '2023-05-01',
        qaList: [
          { id: 1, question: "请介绍一下你自己。", answer: "我是一名有5年经验的软件工程师，专注于前端开发..." },
          { id: 2, question: "你为什么想加入我们公司？", answer: "我被贵公司在人工智能领域的创新所吸引..." },
          { id: 3, question: "你有什么缺点？", answer: "我有时候会过于追求完美，可能会花费更多时间在细节上。" },
          { id: 4, question: "你有什么优点？", answer: "我是一个快速学习的人，能够快速适应新技术。" },
          { id: 5, question: "你有什么职业规划？", answer: "我希望能够在贵公司获得更多成长，成为一名技术专家。" },
          { id: 6, question: "请回答TCP三次握手", answer: "TCP三次握手是TCP协议建立连接的过程，包括三次数据包交换。" },
        ]
      };
      setInterview(mockInterview);
    };

    fetchInterview();
  }, [id]);

  const handleQASelect = (qa: QA) => {
    setSelectedQA(qa);
    const newMessage: Message = { 
      role: 'user', 
      content: `我选择了问题: "${qa.question}"` 
    };
    const aiResponse: Message = { 
      role: 'assistant', 
      content: `您已选中问题"${qa.question}"，您有什么想要了解的？`,
      options: ['评价', '参考答案']
    };
    setMessages(prevMessages => [...prevMessages, newMessage, aiResponse]);
  };

  const handleOptionSelect = (option: string) => {
    if (!selectedQA) return;

    let content = '';
    if (option === '评价') {
      content = `请评价我对问题"${selectedQA.question}"的回答：${selectedQA.answer}`;
    } else if (option === '参考答案') {
      content = `请为问题"${selectedQA.question}"提供一个参考答案。`;
    }

    const newMessage: Message = { role: 'user', content };
    const aiResponse: Message = { role: 'assistant', content: 'AI正在分析您的请求...' };
    setMessages(prevMessages => [...prevMessages, newMessage, aiResponse]);

    // 这里应该调用实际的AI API
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1),
        { role: 'assistant', content: `这是对于"${option}"的模拟AI回复。在实际应用中,这里应该是基于您的请求生成的真实AI回答。` }
      ]);
    }, 1000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input },
      { role: 'assistant', content: 'AI正在分析您的问题...' }
    ];
    setMessages(newMessages);
    setInput('');

    // 这里应该调用实际的AI API
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1),
        { role: 'assistant', content: '这是一个模拟的AI回复。在实际应用中,这里应该是基于您的问题生成的真实AI回答。' }
      ]);
    }, 1000);
  };

  const [leftWidth, setLeftWidth] = useState(50); // 左侧区域宽度百分比
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        setLeftWidth(Math.max(20, Math.min(80, newWidth)));
      }
    },
    [isDragging]
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!interview) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <Link href="/interview-list" className="mb-4 inline-flex items-center text-blue-500 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回面试列表
      </Link>
      
      <h1 className="text-3xl font-bold mb-2">{interview.title}</h1>
      <p className="mb-4 text-gray-600">日期: {interview.date}</p>
      
      {/* 音频进度条 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">面试音频</h2>
        <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${audioProgress}%` }}
          ></div>
        </div>
        <button 
          onClick={() => setAudioProgress(Math.min(audioProgress + 10, 100))}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          模拟音频进度
        </button>
      </div>
      
      {/* 面试记录和分析区 */}
      <div className="flex gap-0 relative flex-1 overflow-hidden">
        {/* 面试问答记录 */}
        <div style={{ width: `${leftWidth}%` }} className="overflow-y-auto pr-4 h-full">
          <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white py-2">面试记录</h2>
          <div className="space-y-4">
            {interview.qaList.map((qa) => (
              <div 
                key={qa.id} 
                className={`p-4 rounded cursor-pointer ${selectedQA?.id === qa.id ? 'bg-blue-100' : 'bg-gray-100'}`}
                onClick={() => handleQASelect(qa)}
              >
                <p className="font-semibold">{qa.question}</p>
                <p className="mt-2">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* 可拖动的分隔线 */}
        <div
          className="w-2 bg-gray-200 hover:bg-blue-500 transition-colors duration-300 cursor-col-resize relative"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        
        {/* AI分析区 */}
        <div style={{ width: `${100 - leftWidth}%` }} className="overflow-y-auto pl-4 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white py-2">AI分析</h2>
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {message.content}
                  {message.role === 'assistant' && 'options' in message && message.options && (
                    <div className="mt-2 space-x-2">
                      {message.options.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

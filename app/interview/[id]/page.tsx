'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'react-feather'; // 导入箭头图标

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

export default function InterviewDetail() {
  const params = useParams();
  const { id } = params;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

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
        ]
      };
      setInterview(mockInterview);
    };

    fetchInterview();
  }, [id]);

  const handleQASelect = (qa: QA) => {
    setSelectedQA(qa);
    // 这里应该调用AI分析API，现在我们只是模拟一个响应
    setAiAnalysis("AI正在分析您的回答...");
    setTimeout(() => {
      setAiAnalysis("您的回答简洁明了，但可以更具体地提到您的技能如何与公司的需求相匹配。建议您可以举一个具体的项目例子来说明您的能力。");
    }, 1000);
  };

  if (!interview) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8">
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
      <div className="flex gap-8">
        {/* 面试问答记录 */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">面试记录</h2>
          {interview.qaList.map((qa) => (
            <div 
              key={qa.id} 
              className={`mb-4 p-4 rounded cursor-pointer ${selectedQA?.id === qa.id ? 'bg-blue-100' : 'bg-gray-100'}`}
              onClick={() => handleQASelect(qa)}
            >
              <p className="font-semibold">{qa.question}</p>
              <p className="mt-2">{qa.answer}</p>
            </div>
          ))}
        </div>
        
        {/* AI分析区 */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">AI分析</h2>
          {selectedQA ? (
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold mb-2">问题：{selectedQA.question}</p>
              <p className="mb-4">您的回答：{selectedQA.answer}</p>
              <h3 className="font-semibold mb-2">AI分析：</h3>
              <p>{aiAnalysis}</p>
            </div>
          ) : (
            <p className="text-gray-500">请从左侧选择一个问答进行分析</p>
          )}
        </div>
      </div>
    </div>
  );
}

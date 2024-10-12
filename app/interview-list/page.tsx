'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'react-feather';

interface Interview {
  id: number;
  title: string;
  date: string;
}

export default function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([
    { id: 1, title: '软件工程师面试', date: '2023-04-15' },
    { id: 2, title: '产品经理面试', date: '2023-04-20' },
    { id: 3, title: '数据分析师面试', date: '2023-04-25' },
  ]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isListVisible, setIsListVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterviews = interviews.filter(interview =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className={`bg-gray-100 dark:bg-gray-800 ${isListVisible ? 'w-56' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">面试列表</h2>
          <button
            onClick={() => setIsListVisible(!isListVisible)}
            className="focus:outline-none"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${isListVisible ? '' : 'transform rotate-180'}`} />
          </button>
        </div>
        <div className="px-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索面试..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2 py-1 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {filteredInterviews.map((interview) => (
            <li key={interview.id} className="mb-2 px-4">
              <button
                onClick={() => setSelectedInterview(interview)}
                className={`w-full text-left p-2 rounded text-sm ${
                  selectedInterview?.id === interview.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {interview.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {!isListVisible && (
        <button
          onClick={() => setIsListVisible(true)}
          className="bg-gray-200 dark:bg-gray-700 p-2 focus:outline-none"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1 p-8">
        {selectedInterview ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">{selectedInterview.title}</h1>
            <p className="mb-4">日期: {selectedInterview.date}</p>
            <p className="mb-4">这里将显示面试的详细信息和分析结果。</p>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>请从左侧列表选择一个面试</p>
          </div>
        )}
      </div>
    </div>
  );
}

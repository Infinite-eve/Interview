'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'react-feather';
import Link from 'next/link';

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
  const [isListVisible, setIsListVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterviews = interviews.filter(interview =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className={`bg-gray-100 dark:bg-gray-800 ${isListVisible ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">面试记录&分析</h2>
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
              <Link href={`/interview/${interview.id}`}>
                <div className={`w-full text-left p-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700`}>
                  <div className="font-semibold">{interview.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{interview.date}</div>
                </div>
              </Link>
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
      <div className="flex-1 p-8 text-center text-gray-500 dark:text-gray-400">
        <p>请从左侧列表选择一个面试</p>
      </div>
    </div>
  );
}

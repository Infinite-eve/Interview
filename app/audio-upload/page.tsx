'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AudioUpload() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !file) {
      alert('请填写所有字段并选择音频文件');
      return;
    }

    // 这里应该是实际的上传逻辑
    console.log('上传音频:', { title, date, file });

    // 模拟上传成功
    alert('上传成功！');
    router.push('/interview-list');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">面试记录上传</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">面试标题</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">面试日期</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="audio" className="block text-sm font-medium text-gray-700">音频文件</label>
          <input
            type="file"
            id="audio"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            上传
          </button>
        </div>
      </form>
    </div>
  );
}

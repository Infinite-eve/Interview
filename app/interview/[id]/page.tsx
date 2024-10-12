'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function InterviewDetail() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">面试详情</h1>
      <p className="mb-4">面试 ID: {id}</p>
      <p className="mb-4">这里将显示面试的详细信息和分析结果。</p>
      <Link href="/interview-list" className="text-blue-500 hover:text-blue-600">
        返回面试列表
      </Link>
    </div>
  );
}

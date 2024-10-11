'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Interview {
  id: string;
  createdAt: string;
  audioUrl: string;
}

export default function InterviewsPage() {
  const { data: session, status } = useSession();
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchInterviews(session.user.id);
    }
  }, [status, session]);

  const fetchInterviews = async (userId: string) => {
    try {
      const response = await fetch(`/api/interviews?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    }
  };

  if (status === 'loading') {
    return <div>加载中...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>请先登录</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">面试记录</h1>
      <ul className="space-y-4">
        {interviews.map((interview) => (
          <li key={interview.id} className="bg-white shadow rounded-lg p-4">
            <Link href={`/interview/${interview.id}`} className="text-blue-600 hover:underline">
              面试记录 - {new Date(interview.createdAt).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
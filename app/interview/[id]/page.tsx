'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Interview {
  id: string;
  audioUrl: string;
  transcript: string | null;
  analysis: string | null;
  summary: string | null;
}

export default function InterviewPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && session?.user?.id) {
      fetchInterview(params.id as string);
    }
  }, [params.id, session]);

  const fetchInterview = async (interviewId: string) => {
    try {
      const response = await fetch(`/api/interview/${interviewId}`);
      if (response.ok) {
        const data = await response.json();
        setInterview(data);
      } else {
        console.error('Failed to fetch interview');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!interview) {
    return <div>未找到面试记录</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">面试详情</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">音频</h2>
        <audio controls src={interview.audioUrl} className="w-full">
          您的浏览器不支持音频元素。
        </audio>
      </div>
      {interview.transcript && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">转录</h2>
          <p className="whitespace-pre-wrap">{interview.transcript}</p>
        </div>
      )}
      {interview.analysis && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">分析</h2>
          <p className="whitespace-pre-wrap">{interview.analysis}</p>
        </div>
      )}
      {interview.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">总结</h2>
          <p className="whitespace-pre-wrap">{interview.summary}</p>
        </div>
      )}
    </div>
  );
}
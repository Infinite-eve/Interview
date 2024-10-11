'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resume, setResume] = useState({
    education: '',
    skills: '',
    projects: '',
    workExperience: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.id) {
      fetchResume(session.user.id);
    }
  }, [status, session]);

  const fetchResume = async (userId: string) => {
    try {
      const response = await fetch(`/api/resume/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setResume(data);
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...resume, userId: session.user.id }),
      });

      if (response.ok) {
        alert('简历更新成功');
      } else {
        alert('简历更新失败');
      }
    } catch (error) {
      console.error('Failed to update resume:', error);
      alert('简历更新失败');
    }
  };

  if (status === 'loading') {
    return <div>加载中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">个人资料</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700">教育背景</label>
          <textarea
            id="education"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={3}
            value={resume.education}
            onChange={(e) => setResume({ ...resume, education: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">技能</label>
          <input
            type="text"
            id="skills"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={resume.skills}
            onChange={(e) => setResume({ ...resume, skills: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="projects" className="block text-sm font-medium text-gray-700">项目经历</label>
          <textarea
            id="projects"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={5}
            value={resume.projects}
            onChange={(e) => setResume({ ...resume, projects: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700">工作经历</label>
          <textarea
            id="workExperience"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={5}
            value={resume.workExperience}
            onChange={(e) => setResume({ ...resume, workExperience: e.target.value })}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            更新简历
          </button>
        </div>
      </form>
    </div>
  );
}
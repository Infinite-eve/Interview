'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !session?.user?.id) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', session.user.id);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/interview/${data.interviewId}`);
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传错误:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">上传面试音频</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700">
            选择音频文件
          </label>
          <input
            type="file"
            id="audio-file"
            accept="audio/*"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {uploading ? '上传中...' : '上传'}
        </button>
      </form>
    </div>
  );
}
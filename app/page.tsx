import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">欢迎使用面试复盘应用</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        这个应用可以帮助您上传面试音频，获取AI分析和建议，提高您的面试技巧。
      </p>
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500 dark:text-blue-300">开始使用：</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li>更新您的个人资料</li>
          <li>上传面试音频</li>
          <li>查看AI分析和建议</li>
        </ul>
      </div>
      <div className="mt-8">
        <Link href="/upload" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          上传面试音频
        </Link>
      </div>
    </div>
  );
}

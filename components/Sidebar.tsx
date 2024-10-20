'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Upload, List } from 'react-feather';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-48 bg-gray-100 h-full flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-blue-600">面试复盘</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/" className={`flex items-center p-2 ${pathname === '/' ? 'bg-blue-100' : ''}`}>
              <Home className="mr-2 w-4 h-4" /> <span className="text-sm">首页</span>
            </Link>
          </li>
          <li>
            <Link href="/profile" className={`flex items-center p-2 ${pathname === '/profile' ? 'bg-blue-100' : ''}`}>
              <User className="mr-2 w-4 h-4" /> <span className="text-sm">个人资料</span>
            </Link>
          </li>
          <li>
            <Link href="/audio-upload" className={`flex items-center p-2 ${pathname === '/audio-upload' ? 'bg-blue-100' : ''}`}>
              <Upload className="mr-2 w-4 h-4" /> <span className="text-sm">面试记录上传</span>
            </Link>
          </li>
          <li>
            <Link href="/interview-list" className={`flex items-center p-2 ${pathname === '/interview-list' ? 'bg-blue-100' : ''}`}>
              <List className="mr-2 w-4 h-4" /> <span className="text-sm">面试记录&分析</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

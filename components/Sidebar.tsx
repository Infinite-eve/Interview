'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, User, FileText, Upload, LogOut, LogIn, Sun, Moon } from 'react-feather';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/profile', label: '个人资料', icon: User },
  { href: '/interviews', label: '面试记录', icon: FileText },
  { href: '/upload', label: '上传音频', icon: Upload },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">面试复盘</div>
      <ul>
        {navItems.map((item) => (
          <li key={item.href} className="mb-4">
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                pathname === item.href ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
            >
              <item.icon className="mr-2" size={18} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="flex items-center w-full p-2 mt-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
        >
          {theme === 'light' ? <Moon className="mr-2" size={18} /> : <Sun className="mr-2" size={18} />}
          {theme === 'light' ? '切换到暗色模式' : '切换到浅色模式'}
        </button>
        {session ? (
          <button
            onClick={() => signOut()}
            className="flex items-center w-full p-2 mt-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            <LogOut className="mr-2" size={18} />
            注销
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center w-full p-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            <LogIn className="mr-2" size={18} />
            登录
          </Link>
        )}
      </div>
    </nav>
  );
}
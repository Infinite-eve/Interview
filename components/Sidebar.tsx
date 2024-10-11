'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/profile', label: '个人资料' },
  { href: '/interviews', label: '面试记录' },
  { href: '/upload', label: '上传音频' },  // 新增这一行
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">面试复盘</div>
      <ul>
        {navItems.map((item) => (
          <li key={item.href} className="mb-4">
            <Link
              href={item.href}
              className={`block p-2 rounded hover:bg-gray-700 ${
                pathname === item.href ? 'bg-gray-700' : ''
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
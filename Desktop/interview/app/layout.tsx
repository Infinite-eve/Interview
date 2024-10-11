import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '../components/Sidebar';
import AuthProvider from './AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '面试复盘应用',
  description: '上传面试音频，获取AI分析和建议',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <AuthProvider>
        <body className={inter.className}>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">{children}</main>
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '../components/Sidebar';
import AuthProvider from './AuthProvider';
import { ThemeProvider } from '../contexts/ThemeContext';

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
        <ThemeProvider>
          <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto p-8">{children}</main>
            </div>
          </body>
        </ThemeProvider>
      </AuthProvider>
    </html>
  );
}

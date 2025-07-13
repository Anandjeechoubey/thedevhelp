import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '@/lib/themeContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Money Manager',
  description: 'Track your daily expenses with ease.',
  icons: {
    icon: [
      { url: '/money_manger_assets/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/money_manger_assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/money_manger_assets/favicon-192.png' },
    ],
    shortcut: ['/money_manger_assets/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Force light mode unless dark class is specifically added */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            color-scheme: light;
          }
          .dark {
            color-scheme: dark;
          }
        `}} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-gray-100',
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

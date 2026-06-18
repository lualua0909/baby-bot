import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Bé Tom — AI Pet cho trẻ em',
  description: 'Bạn thú 3D thông minh — trò chuyện, kể chuyện, học tiếng Anh và chơi game!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} min-h-screen font-nunito antialiased`}>
        {children}
      </body>
    </html>
  );
}

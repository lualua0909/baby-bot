import type { Metadata } from 'next';
import { Baloo_2, Fredoka, Nunito, Yatra_One } from 'next/font/google';
import './globals.css';

const baloo = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-baloo',
});

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
});

const nunito = Nunito({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

const yatraOne = Yatra_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-yatra',
});

export const metadata: Metadata = {
  title: 'Bé Tom — AI Pet cho trẻ em',
  description: 'AI BOT 3D thông minh — trò chuyện, kể chuyện, học tiếng Anh và chơi game!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${baloo.variable} ${fredoka.variable} ${nunito.variable} ${yatraOne.variable} min-h-screen font-cartoon antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

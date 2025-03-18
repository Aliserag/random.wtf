import type { Metadata } from 'next';
import './globals.css';
import ConnectWallet from './components/ConnectWallet';

export const metadata: Metadata = {
  title: 'Randoms.WTF - True Random Generator',
  description: 'Generate true random numbers and selections using Flow VRF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-black">
        <ConnectWallet />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyTurn',
  description: 'Tablet-first classroom shell for a 15-minute English class',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body bg-classroom-muted text-classroom-ink antialiased">
        {children}
      </body>
    </html>
  );
}

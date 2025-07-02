import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Maestro',
  description: 'Your career starts here',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

'use client';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, minHeight: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 
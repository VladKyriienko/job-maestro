"use client";
import styles from './AdminSidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

const sections = [
  { name: 'FAQs', key: 'faqs', href: '/admin/faqs' },
  { name: 'Advice', key: 'advice', href: '/admin/advice' },
  { name: 'Documents', key: 'documents', href: '/admin/documents' },
  { name: 'Job Categories', key: 'job-categories', href: '/admin/job-categories' },
  { name: 'Jobs', key: 'jobs', href: '/admin/jobs' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Admin</div>
      <nav className={styles.nav}>
        {sections.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            className={
              pathname === section.href
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
          >
            {section.name}
          </Link>
        ))}
      </nav>
      <button 
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        Log Out
      </button>
    </aside>
  );
} 
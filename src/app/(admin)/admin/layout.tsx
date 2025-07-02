import AdminAuth from '@/components/auth/AdminAuth';
import styles from './Admin.module.css';
import AdminSidebar from '@/components/common/AdminSidebar/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuth>
    <div className={styles.adminContainer}>
      <AdminSidebar />
        <div className={styles.mainContent}>{children}</div>
    </div>
    </AdminAuth>
  );
} 
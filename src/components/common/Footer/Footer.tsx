'use client';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
          <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} JobMaestro. All Rights Reserved.
          </p>
        <div className={styles.links}>
          <div className={styles.menuWrapper}>
            <button className={styles.link}>
              Terms and Conditions
            </button>
            <div className={styles.dropdown}>
              <Link href="/terms-and-conditions?type=jobseeker" className={styles.dropdownItem}>
                Jobseeker Terms and Conditions
              </Link>
              <Link href="/terms-and-conditions?type=advertiser" className={styles.dropdownItem}>
                Advertiser Terms and Conditions
              </Link>
            </div>
          </div>
          <Link href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
} 
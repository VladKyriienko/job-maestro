'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import React, { useState, useEffect } from 'react';
import Modal from '../../modals/Modal';
import JobseekerSignUpForm from '../../forms/SignUp/JobseekerSignUpForm';
import JobseekerSignInForm from '../../forms/SignIn/JobseekerSignInForm';
import ForgottenPasswordForm from '../../forms/RessetPassword/ForgottenPasswordForm';
import { supabase } from '@/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [modalType, setModalType] = useState<null | 'jobseeker-signup' | 'jobseeker-signin' | 'forgotten-password'>(null);
  const [user, setUser] = useState<User | null>(null);

  // Track auth state
  useEffect(() => {
    let ignore = false;
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!ignore) setUser(data.session?.user ?? null);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => {
      ignore = true;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            {isHomePage ? (
              <>
                <a href="#" className={styles.postJobLink}>
                  Post a Job (FREE)
                </a>
                <a href="#" className={styles.jobSearchLink}>
                  USA Job Search
                </a>
              </>
            ) : (
              <Link href="/" className={styles.homeLink}>
                Home
              </Link>
            )}
          </div>
          
          <div className={styles.rightSection}>
            <div className={styles.menuWrapper}>
              <button className={styles.menuButton}>
                Menu
              </button>
              <div className={styles.dropdown}>
                <Link href="/advice" className={styles.dropdownItem}>
                  Advice
                </Link>
                <Link href="/faqs" className={styles.dropdownItem}>
                  FAQs
                </Link>
                <Link href="/contact-us" className={styles.dropdownItem}>
                  Contact Us
                </Link>
              </div>
            </div>
            {/* Conditionally render auth buttons */}
            {user ? (
              <button className={styles.menuButton} onClick={handleLogout} style={{marginLeft: 12}}>
                Log Out
              </button>
            ) : (
              <>
                <div className={styles.menuWrapper}>
                  <button className={`${styles.menuButton} ${styles.signInLink}`}>
                    Sign In
                  </button>
                  <div className={styles.dropdown}>
                    <a
                      href="#"
                      className={styles.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        setModalType('jobseeker-signin');
                      }}
                    >
                      Jobseeker Sign In
                    </a>
                    <div className={styles.dropdownItemWithNote}>
                      <a href="#" className={styles.dropdownItem}>Advertiser Sign In</a>
                      <span className={styles.comingSoonNote}>Coming soon</span>
                    </div>
                  </div>
                </div>
                <div className={styles.menuWrapper}>
                  <button className={`${styles.menuButton} ${styles.signUpLink}`}>
                    Sign Up
                  </button>
                  <div className={styles.dropdown}>
                    <a
                      href="#"
                      className={styles.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        setModalType('jobseeker-signup');
                      }}
                    >
                      Jobseeker Sign Up
                    </a>
                    <div className={styles.dropdownItemWithNote}>
                      <a href="#" className={styles.dropdownItem}>Advertiser Sign Up</a>
                      <span className={styles.comingSoonNote}>Coming soon</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <Modal
        isOpen={modalType === 'jobseeker-signup'}
        onClose={() => setModalType(null)}
      >
        <JobseekerSignUpForm
          onCancel={() => setModalType(null)}
          onConfirm={() => setModalType(null)}
        />
      </Modal>
      <Modal
        isOpen={modalType === 'jobseeker-signin'}
        onClose={() => setModalType(null)}
      >
        <JobseekerSignInForm
          onCancel={() => setModalType(null)}
          onContinue={() => setModalType(null)}
          onSignUp={() => setModalType('jobseeker-signup')}
          onForgot={() => setModalType('forgotten-password')}
        />
      </Modal>
      <Modal
        isOpen={modalType === 'forgotten-password'}
        onClose={() => setModalType(null)}
      >
        <ForgottenPasswordForm
          onBack={() => setModalType('jobseeker-signin')}
          onReset={() => setModalType(null)}
        />
      </Modal>
    </>
  );
} 
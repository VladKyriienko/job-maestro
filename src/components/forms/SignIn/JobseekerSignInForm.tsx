import React, { useState } from 'react';
import styles from './JobseekerSignInForm.module.css';
import { supabase } from '../../../supabaseClient';
import { useRouter } from 'next/navigation';

interface Props {
  onCancel: () => void;
  onContinue: () => void;
  onSignUp: () => void;
  onForgot: () => void;
}

const JobseekerSignInForm: React.FC<Props> = ({ onCancel, onContinue, onSignUp, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Sign in user
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (signInError) {
        setError(signInError.message || 'Sign in failed.');
        setLoading(false);
        return;
      }

      if (!user) {
        setError('User not found.');
        setLoading(false);
        return;
      }

      // Check user role
      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        setError('Failed to fetch user profile.');
        setLoading(false);
        return;
      }

      setLoading(false);

      // Redirect based on role
      if (profile?.role === 'admin') {
        router.push('/admin');
      } else {
        onContinue();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>Sign in to your jobseeker profile</div>
      <div className={styles.fieldsCol}>
        <label className={styles.label}>
          Email address
          <input className={styles.input} type="email" placeholder="e.g. Jonathan@yahoo.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label className={styles.label}>
          Password
          <input className={styles.input} type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" className={styles.checkbox} />
          Remember Me
        </label>
      </div>
      <div className={styles.linksRow}>
        <span className={styles.link} onClick={onSignUp} tabIndex={0} role="button">No account? Sign Up</span>
        <span className={styles.link} onClick={onForgot} tabIndex={0} role="button">Forgotten your password?</span>
      </div>
      {error && <div style={{ color: '#c0392b', textAlign: 'center', marginTop: 12 }}>{error}</div>}
      <div className={styles.actionRow}>
        <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className={styles.continueButton} disabled={loading}>{loading ? 'Signing in...' : 'Continue'}</button>
      </div>
    </form>
  );
};

export default JobseekerSignInForm; 
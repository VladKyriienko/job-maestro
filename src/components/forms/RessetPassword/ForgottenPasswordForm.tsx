import React, { useState } from 'react';
import styles from './ForgottenPasswordForm.module.css';
import { supabase } from '../../../supabaseClient';

interface Props {
  onBack: () => void;
  onReset: () => void;
}

const ForgottenPasswordForm: React.FC<Props> = ({ onBack, onReset }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message || 'Failed to send reset email.');
    } else {
      setSuccess('Password reset email sent! Please check your inbox.');
      setTimeout(() => {
        onReset();
      }, 2000);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>Forgotten Password</div>
      <div className={styles.fieldsCol}>
        <label className={styles.label}>
          Email address
          <input className={styles.input} type="email" placeholder="e.g. Jonathan@yahoo.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
      </div>
      {error && <div style={{ color: '#c0392b', textAlign: 'center', marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: '#21806a', textAlign: 'center', marginTop: 12 }}>{success}</div>}
      <div className={styles.actionRow}>
        <button type="button" className={styles.backButton} onClick={onBack} disabled={loading}>Back</button>
        <button type="submit" className={styles.resetButton} disabled={loading}>{loading ? 'Sending...' : 'Reset Password'}</button>
      </div>
    </form>
  );
};

export default ForgottenPasswordForm; 
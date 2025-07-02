import React, { useRef, useState } from 'react';
import Link from 'next/link';
import styles from './JobseekerSignUpForm.module.css';
import { supabase } from '../../../supabaseClient';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

const JobseekerSignUpForm: React.FC<Props> = ({ onCancel, onConfirm }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Controlled state for all fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [workingStatus, setWorkingStatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Feedback state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      // 1. Register user with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError || !signUpData.user) {
        setError(signUpError?.message || 'Sign up failed.');
        setLoading(false);
        return;
      }
      const userId = signUpData.user.id;

      // 2. Upload resume file if provided
      let resumeUrl = '';
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const filePath = `resumes/${userId}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, resumeFile);
        if (uploadError) {
          setError('Resume upload failed.');
          setLoading(false);
          return;
        }
        const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(filePath);
        resumeUrl = publicUrlData.publicUrl;
      }

      // 3. Insert profile into Profile table
      const { error: insertError } = await supabase.from('profile').insert([
        {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          job_title: jobTitle,
          working_status: workingStatus,
          email,
          resume_url: resumeUrl,
          role: 'jobseeker',
        },
      ]);
      if (insertError) {
        setError('Failed to save profile.');
        setLoading(false);
        return;
      }
      setSuccess('Sign up successful! Please check your email to confirm your account.');
      setLoading(false);
      onConfirm();
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>Create your jobseeker profile</div>
      <div className={styles.fieldsGrid}>
        <div className={styles.fieldCol}>
          <label className={styles.label}>
            First name*
            <input className={styles.input} type="text" placeholder="e.g. Jonathan" required value={firstName} onChange={e => setFirstName(e.target.value)} />
          </label>
          <label className={styles.label}>
            Last name*
            <input className={styles.input} type="text" placeholder="e.g. Dowe" required value={lastName} onChange={e => setLastName(e.target.value)} />
          </label>
          <label className={styles.label}>
            The job title that best describes me
            <input className={styles.input} type="text" placeholder="e.g. AWS Specialist" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
          </label>
          <label className={styles.label}>
            Upload a resume
            <div className={styles.uploadWrapper}>
              <input ref={fileInputRef} className={styles.input} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
              <button type="button" className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
                <span className={styles.uploadIcon}>⭳</span>
              </button>
              {resumeFile && <span style={{ fontSize: 10, color: '#21806a', marginLeft: 8 }}>{resumeFile.name}</span>}
            </div>
          </label>
        </div>
        <div className={styles.fieldCol}>
          <label className={styles.label}>
            Confirm your UK working status*
            <select className={styles.input} required value={workingStatus} onChange={e => setWorkingStatus(e.target.value)}>
              <option value="">Select...</option>
              <option value="uk-citizen">UK Citizen</option>
              <option value="eu-citizen">EU Citizen</option>
              <option value="indefinite-leave">Indefinite Leave to Remain</option>
              <option value="work-permit-no-sponsorship">Work Permit Holder (No Sponsorship Required)</option>
              <option value="work-permit-sponsorship">Work Permit Holder (Sponsorship Required)</option>
              <option value="sponsorship-required">Sponsorship Required (No Work Permit)</option>
            </select>
          </label>
          <label className={styles.label}>
            Email address*
            <input className={styles.input} type="email" placeholder="e.g. Jonathan@yahoo.com" required value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className={styles.label}>
            Create a password*
            <input className={styles.input} type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <label className={styles.label}>
            Confirm password*
            <input className={styles.input} type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </label>
        </div>
      </div>
      <div className={styles.policyRow}>
        <Link href="/privacy-policy" className={styles.policyButton} target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
        <Link href="/terms-and-conditions" className={styles.policyButton} target="_blank" rel="noopener noreferrer">Terms and Conditions</Link>
      </div>
      {error && <div style={{ color: '#c0392b', textAlign: 'center', marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: '#21806a', textAlign: 'center', marginTop: 12 }}>{success}</div>}
      <div className={styles.actionRow}>
        <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className={styles.confirmButton} disabled={loading}>{loading ? 'Signing up...' : 'Confirm'}</button>
      </div>
    </form>
  );
};

export default JobseekerSignUpForm; 
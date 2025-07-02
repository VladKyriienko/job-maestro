'use client';

import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
import styles from './AddJobModal.module.css';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: () => void;
}

const AddJobModal = ({ isOpen, onClose, onJobAdded }: AddJobModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    hours_per_day: '',
    job_type: '',
    contract_length: '',
    contract_type: '',
    job_category: '',
    active: true
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const contractLengthOptions = Array.from({ length: 24 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} month${i + 1 !== 1 ? 's' : ''}`
  }));

  const jobTypeOptions = [
    { value: 'in the office', label: 'In the office' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const contractTypeOptions = [
    { value: 'Inside iR35', label: 'Inside iR35' },
    { value: 'Umbrella PAYE', label: 'Umbrella PAYE' },
    { value: 'Outside iR35', label: 'Outside iR35' }
  ];

  const jobCategoryOptions = [
    { value: 'IT & Software Development', label: 'IT & Software Development' },
    { value: 'Finance & Accounting', label: 'Finance & Accounting' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Healthcare & Medical', label: 'Healthcare & Medical' },
    { value: 'Marketing & Communications', label: 'Marketing & Communications' },
    { value: 'Education & Training', label: 'Education & Training' },
    { value: 'Transport & Logistics', label: 'Transport & Logistics' },
    { value: 'Legal & Compliance', label: 'Legal & Compliance' },
    { value: 'Project Management', label: 'Project Management' },
    { value: 'Sales & Business Development', label: 'Sales & Business Development' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Other', label: 'Other' }
  ];

  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      salary: '',
      hours_per_day: '',
      job_type: '',
      contract_length: '',
      contract_type: '',
      job_category: '',
      active: true
    });
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim()) {
      setFormError('Job title is required.');
      return;
    }
    setFormLoading(true);
    
    // Get current user for posted_by
    const { data: { user } } = await supabase.auth.getUser();
    
    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      location: formData.location.trim() || null,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      hours_per_day: formData.hours_per_day ? parseFloat(formData.hours_per_day) : null,
      job_type: formData.job_type || null,
      contract_length: formData.contract_length ? parseInt(formData.contract_length) : null,
      contract_type: formData.contract_type || null,
      job_category: formData.job_category || null,
      posted_by: user?.email || null,
      active: formData.active
    };

    console.log('Inserting job data:', jobData);
    const { data, error } = await supabase.from('jobs').insert(jobData);
    console.log('Insert result:', { data, error });
    setFormLoading(false);
    if (error) {
      console.error('Insert error details:', error);
      setFormError(`Failed to add job: ${error.message}`);
      return;
    }
    resetFormData();
    onJobAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleAddJob} className={styles.form}>
        <h3 className={styles.formTitle}>Add New Job</h3>
        
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <label className={styles.label}>
              Job Title *
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className={styles.input}
                disabled={formLoading}
                placeholder="e.g., Senior Software Developer"
              />
            </label>

            <label className={styles.label}>
              Location
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className={styles.input}
                disabled={formLoading}
                placeholder="e.g., London, UK"
              />
            </label>

            <label className={styles.label}>
              Salary (£)
              <input
                type="number"
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
                className={styles.input}
                disabled={formLoading}
                placeholder="e.g., 75000"
              />
            </label>

            <label className={styles.label}>
              Hours per Day
              <input
                type="number"
                step="0.5"
                value={formData.hours_per_day}
                onChange={e => setFormData({...formData, hours_per_day: e.target.value})}
                className={styles.input}
                disabled={formLoading}
                placeholder="e.g., 7.5"
              />
            </label>
          </div>

          <div className={styles.formColumn}>
            <label className={styles.label}>
              Job Type
              <select
                value={formData.job_type}
                onChange={e => setFormData({...formData, job_type: e.target.value})}
                className={styles.input}
                disabled={formLoading}
              >
                <option value="">Select job type</option>
                {jobTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Contract Length
              <select
                value={formData.contract_length}
                onChange={e => setFormData({...formData, contract_length: e.target.value})}
                className={styles.input}
                disabled={formLoading}
              >
                <option value="">Select contract length</option>
                {contractLengthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Contract Type
              <select
                value={formData.contract_type}
                onChange={e => setFormData({...formData, contract_type: e.target.value})}
                className={styles.input}
                disabled={formLoading}
              >
                <option value="">Select contract type</option>
                {contractTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Job Category
              <select
                value={formData.job_category}
                onChange={e => setFormData({...formData, job_category: e.target.value})}
                className={styles.input}
                disabled={formLoading}
              >
                <option value="">Select job category</option>
                {jobCategoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={e => setFormData({...formData, active: e.target.checked})}
                disabled={formLoading}
              />
              Active
            </label>
          </div>
        </div>

        <label className={styles.label}>
          Description
          <RichTextEditor
            content={formData.description}
            onChange={(value) => setFormData({...formData, description: value})}
          />
        </label>

        {formError && <div className={styles.error}>{formError}</div>}

        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={handleClose} 
            className={styles.cancelButton}
            disabled={formLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={formLoading}
          >
            {formLoading ? 'Adding...' : 'Add Job'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobModal; 
'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
import styles from './EditAdviceModal.module.css';

interface Advice {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
}

interface EditAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdviceUpdated: () => void;
  advice: Advice | null;
}

const EditAdviceModal = ({ isOpen, onClose, onAdviceUpdated, advice }: EditAdviceModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Generate slug from title
  const slug = useMemo(() => generateSlug(formData.title), [formData.title]);

  // Populate form data when advice prop changes
  useEffect(() => {
    if (advice) {
      setFormData({
        title: advice.title || '',
        subtitle: advice.subtitle || '',
        description: advice.description || ''
      });
    }
  }, [advice]);

  const resetFormData = () => {
    if (advice) {
      setFormData({
        title: advice.title || '',
        subtitle: advice.subtitle || '',
        description: advice.description || ''
      });
    }
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleUpdateAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim() || !formData.subtitle.trim() || !formData.description.trim()) {
      setFormError('All fields are required.');
      return;
    }
    if (!advice) {
      setFormError('No advice selected for editing.');
      return;
    }
    setFormLoading(true);
    
    const { error } = await supabase
      .from('advice')
      .update({ 
        title: formData.title, 
        subtitle: formData.subtitle, 
        description: formData.description, 
        slug: slug 
      })
      .eq('id', advice.id);
    setFormLoading(false);
    if (error) {
      console.error('Update error details:', error);
      setFormError('Failed to update advice. Please try again.');
      return;
    }
    onAdviceUpdated();
    onClose();
  };

  if (!advice) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleUpdateAdvice} className={styles.form}>
        <h3 className={styles.formTitle}>Edit Advice</h3>
        
        <label className={styles.label}>
          Title *
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className={styles.input}
            disabled={formLoading}
            placeholder="e.g., How to Write a Perfect CV"
          />
        </label>

        {formData.title && (
          <div className={styles.slugPreview}>
            Generated slug: {slug}
          </div>
        )}

        <label className={styles.label}>
          Subtitle *
          <input
            type="text"
            value={formData.subtitle}
            onChange={e => setFormData({...formData, subtitle: e.target.value})}
            className={styles.input}
            disabled={formLoading}
            placeholder="e.g., Tips and tricks for creating an outstanding CV"
          />
        </label>

        <label className={styles.label}>
          Description *
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
            {formLoading ? 'Updating...' : 'Update Advice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditAdviceModal; 
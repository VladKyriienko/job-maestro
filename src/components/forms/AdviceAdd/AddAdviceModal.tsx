'use client';

import { useState, useMemo } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
import styles from './AddAdviceModal.module.css';

interface AddAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdviceAdded: () => void;
}

const AddAdviceModal = ({ isOpen, onClose, onAdviceAdded }: AddAdviceModalProps) => {
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

  const resetFormData = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: ''
    });
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleAddAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim() || !formData.subtitle.trim() || !formData.description.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setFormLoading(true);
    
    const { error } = await supabase.from('advice').insert({ 
      title: formData.title, 
      subtitle: formData.subtitle, 
      description: formData.description, 
      slug: slug 
    });
    setFormLoading(false);
    if (error) {
      console.error('Supabase insert error:', error);
      setFormError('Failed to add advice. Please try again.');
      return;
    }
    resetFormData();
    onAdviceAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleAddAdvice} className={styles.form}>
        <h3 className={styles.formTitle}>Add New Advice</h3>
        
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
            {formLoading ? 'Adding...' : 'Add Advice'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAdviceModal; 
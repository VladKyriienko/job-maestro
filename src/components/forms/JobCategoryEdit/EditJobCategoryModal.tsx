'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import styles from './EditJobCategoryModal.module.css';

interface JobCategory {
  id: number;
  name: string;
}

interface EditJobCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void;
  category: JobCategory | null;
}

const EditJobCategoryModal = ({ isOpen, onClose, onCategoryUpdated, category }: EditJobCategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Populate form data when category prop changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || ''
      });
    }
  }, [category]);

  const resetFormData = () => {
    if (category) {
      setFormData({
        name: category.name || ''
      });
    }
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    if (!category) {
      setFormError('No category selected for editing.');
      return;
    }
    setFormLoading(true);
    
    const { error } = await supabase
      .from('job_categories')
      .update({ 
        name: formData.name.trim()
      })
      .eq('id', category.id);
    setFormLoading(false);
    if (error) {
      console.error('Update error details:', error);
      if (error.code === '23505') { // Unique constraint violation
        setFormError('A category with this name already exists.');
      } else {
        setFormError('Failed to update category. Please try again.');
      }
      return;
    }
    onCategoryUpdated();
    onClose();
  };

  if (!category) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleUpdateCategory} className={styles.form}>
        <h3 className={styles.formTitle}>Edit Job Category</h3>
        
        <label className={styles.label}>
          Category Name *
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className={styles.input}
            disabled={formLoading}
            placeholder="e.g., Software Development"
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
            {formLoading ? 'Updating...' : 'Update Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditJobCategoryModal; 
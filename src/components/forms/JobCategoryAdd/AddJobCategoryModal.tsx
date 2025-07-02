'use client';

import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import styles from './AddJobCategoryModal.module.css';

interface AddJobCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

const AddJobCategoryModal = ({ isOpen, onClose, onCategoryAdded }: AddJobCategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const resetFormData = () => {
    setFormData({
      name: ''
    });
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    setFormLoading(true);
    
    console.log('Inserting category:', { name: formData.name.trim() });
    const { data, error } = await supabase.from('job_categories').insert({ 
      name: formData.name.trim()
    });
    console.log('Insert category result:', { data, error });
    setFormLoading(false);
    if (error) {
      console.error('Category insert error details:', error);
      if (error.code === '23505') { // Unique constraint violation
        setFormError('A category with this name already exists.');
      } else {
        setFormError(`Failed to add category: ${error.message}`);
      }
      return;
    }
    resetFormData();
    onCategoryAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleAddCategory} className={styles.form}>
        <h3 className={styles.formTitle}>Add New Job Category</h3>
        
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
            {formLoading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobCategoryModal; 
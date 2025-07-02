'use client';

import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
import styles from './AddDocumentModal.module.css';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: () => void;
}

const AddDocumentModal = ({ isOpen, onClose, onDocumentAdded }: AddDocumentModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: true,
    type: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const TYPE_OPTIONS = [
    'Jobseeker Terms and Conditions',
    'Advertiser Terms and Conditions',
    'Privacy Policy',
  ];

  const resetFormData = () => {
    setFormData({
      title: '',
      content: '',
      active: true,
      type: ''
    });
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim() || !formData.content.trim() || !formData.type.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setFormLoading(true);
    
    console.log('Inserting:', { title: formData.title, content: formData.content, active: formData.active, type: formData.type });
    const { data, error, status, statusText } = await supabase.from('document').insert({ 
      title: formData.title, 
      content: formData.content, 
      active: formData.active,
      type: formData.type
    });
    console.log('Insert response:', { data, error, status, statusText });
    setFormLoading(false);
    if (error) {
      console.error('Supabase insert error:', error);
      setFormError(error.message || 'Failed to add document. Please try again.');
      return;
    }
    resetFormData();
    onDocumentAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleAddDocument} className={styles.form}>
        <h3 className={styles.formTitle}>Add New Document</h3>
        
        <label className={styles.label}>
          Title *
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className={styles.input}
            disabled={formLoading}
            placeholder="e.g., Privacy Policy"
          />
        </label>

        <label className={styles.label}>
          Type *
          <select
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
            className={styles.input}
            disabled={formLoading}
          >
            <option value="">Select type</option>
            {TYPE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Content *
          <RichTextEditor
            content={formData.content}
            onChange={(value) => setFormData({...formData, content: value})}
          />
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
            {formLoading ? 'Adding...' : 'Add Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDocumentModal; 
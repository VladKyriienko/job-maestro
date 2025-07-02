'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
import styles from './EditDocumentModal.module.css';

interface Document {
  id: number;
  title: string;
  content: string;
  active: boolean;
  type: string;
}

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentUpdated: () => void;
  document: Document | null;
}

const EditDocumentModal = ({ isOpen, onClose, onDocumentUpdated, document }: EditDocumentModalProps) => {
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

  // Populate form data when document prop changes
  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        content: document.content || '',
        active: document.active ?? true,
        type: document.type || ''
      });
    }
  }, [document]);

  const resetFormData = () => {
    if (document) {
      setFormData({
        title: document.title || '',
        content: document.content || '',
        active: document.active ?? true,
        type: document.type || ''
      });
    }
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim() || !formData.content.trim() || !formData.type.trim()) {
      setFormError('All fields are required.');
      return;
    }
    if (!document) {
      setFormError('No document selected for editing.');
      return;
    }
    setFormLoading(true);
    
    const { error } = await supabase
      .from('document')
      .update({ 
        title: formData.title, 
        content: formData.content, 
        active: formData.active,
        type: formData.type
      })
      .eq('id', document.id);
    setFormLoading(false);
    if (error) {
      console.error('Update error details:', error);
      setFormError('Failed to update document. Please try again.');
      return;
    }
    onDocumentUpdated();
    onClose();
  };

  if (!document) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleUpdateDocument} className={styles.form}>
        <h3 className={styles.formTitle}>Edit Document</h3>
        
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
            {formLoading ? 'Updating...' : 'Update Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDocumentModal; 
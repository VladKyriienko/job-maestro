'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import styles from './EditFaqsModal.module.css';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface EditFaqsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFaqUpdated: () => void;
  faq: Faq | null;
}

const EditFaqsModal = ({ isOpen, onClose, onFaqUpdated, faq }: EditFaqsModalProps) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Populate form data when faq prop changes
  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || ''
      });
    }
  }, [faq]);

  const resetFormData = () => {
    if (faq) {
      setFormData({
        question: faq.question || '',
        answer: faq.answer || ''
      });
    }
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleUpdateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.question.trim() || !formData.answer.trim()) {
      setFormError('Both question and answer are required.');
      return;
    }
    if (!faq) {
      setFormError('No FAQ selected for editing.');
      return;
    }
    setFormLoading(true);
    
    const { error } = await supabase
      .from('faqs')
      .update({ 
        question: formData.question, 
        answer: formData.answer 
      })
      .eq('id', faq.id);
    setFormLoading(false);
    if (error) {
      console.error('Update error details:', error);
      setFormError('Failed to update FAQ. Please try again.');
      return;
    }
    onFaqUpdated();
    onClose();
  };

  if (!faq) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleUpdateFaq} className={styles.form}>
        <h3 className={styles.formTitle}>Edit FAQ</h3>
        
        <label className={styles.label}>
          Question *
          <input
            type="text"
            value={formData.question}
            onChange={e => setFormData({...formData, question: e.target.value})}
            className={styles.input}
            disabled={formLoading}
            placeholder="e.g., How do I apply for a job?"
          />
        </label>

        <label className={styles.label}>
          Answer *
          <textarea
            value={formData.answer}
            onChange={e => setFormData({...formData, answer: e.target.value})}
            className={styles.textarea}
            disabled={formLoading}
            rows={6}
            placeholder="Provide a detailed answer to the question..."
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
            {formLoading ? 'Updating...' : 'Update FAQ'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditFaqsModal; 
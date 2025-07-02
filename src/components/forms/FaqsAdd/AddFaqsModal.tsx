'use client';

import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import Modal from '../../modals/Modal';
import styles from './AddFaqsModal.module.css';

interface AddFaqsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFaqAdded: () => void;
}

const AddFaqsModal = ({ isOpen, onClose, onFaqAdded }: AddFaqsModalProps) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const resetFormData = () => {
    setFormData({
      question: '',
      answer: ''
    });
    setFormError('');
  };

  const handleClose = () => {
    resetFormData();
    onClose();
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.question.trim() || !formData.answer.trim()) {
      setFormError('Both question and answer are required.');
      return;
    }
    setFormLoading(true);
    
    const { error } = await supabase.from('faqs').insert({ 
      question: formData.question, 
      answer: formData.answer 
    });
    setFormLoading(false);
    if (error) {
      console.error('Supabase insert error:', error);
      setFormError('Failed to add FAQ. Please try again.');
      return;
    }
    resetFormData();
    onFaqAdded();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleAddFaq} className={styles.form}>
        <h3 className={styles.formTitle}>Add New FAQ</h3>
        
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
            {formLoading ? 'Adding...' : 'Add FAQ'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFaqsModal; 
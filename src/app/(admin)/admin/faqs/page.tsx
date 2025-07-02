'use client';
import adminStyles from '../Admin.module.css';
import adminFaqs from './FaqsAdmin.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import AddFaqsModal from '../../../../components/forms/FaqsAdd/AddFaqsModal';
import EditFaqsModal from '../../../../components/forms/FaqsEdit/EditFaqsModal';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<{ id: number; question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<{ id: number; question: string; answer: string } | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<number | null>(null);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, answer')
      .order('id', { ascending: true });
    if (!error && data) setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleEditClick = (faq: { id: number; question: string; answer: string }) => {
    setEditingFaq(faq);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setEditingFaq(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    setDeletingFaq(id);
    await supabase.from('faqs').delete().eq('id', id);
    setDeletingFaq(null);
    fetchFaqs();
  };

  return (
    <>
      <div className={adminStyles.headerContainer}>
        <h2 className={adminStyles.heading}>FAQs</h2>
        <div className={adminStyles.countBadge}>
          {loading ? '...' : faqs.length}
        </div>
      </div>
      
      <button 
        className={adminStyles.addButton} 
        onClick={() => setShowAddModal(true)}
      >
        Add FAQ
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : faqs.length === 0 ? (
        <div>No FAQs found.</div>
      ) : (
        <ul className={adminStyles.list}>
          {faqs.map(faq => (
            <li key={faq.id} className={adminStyles.listItem}>
              <div className={adminFaqs.itemContent}>
                <div className={adminStyles.itemHeader}>
                  <div className={adminFaqs.question}>{faq.question}</div>
                  <div className={adminStyles.itemActions}>
                    <button 
                      className={adminStyles.editButton} 
                      onClick={() => handleEditClick(faq)}
                      disabled={deletingFaq === faq.id}
                    >
                      Edit
                    </button>
                    <button 
                      className={adminStyles.deleteButton} 
                      onClick={() => handleDelete(faq.id)}
                      disabled={deletingFaq === faq.id}
                    >
                      {deletingFaq === faq.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
                <div className={adminFaqs.answer}>{faq.answer}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AddFaqsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onFaqAdded={() => {
          setShowAddModal(false);
          fetchFaqs();
        }}
      />

      <EditFaqsModal
        isOpen={showEditModal}
        onClose={handleEditClose}
        onFaqUpdated={() => {
          handleEditClose();
          fetchFaqs();
        }}
        faq={editingFaq}
      />
    </>
  );
} 
'use client';
import adminStyles from '../Admin.module.css';
import adminAdvice from './AdviceAdmin.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import AddAdviceModal from '@/components/forms/AdviceAdd/AddAdviceModal';
import EditAdviceModal from '@/components/forms/AdviceEdit/EditAdviceModal';

export default function AdminAdvicePage() {
  const [advice, setAdvice] = useState<{ id: number; title: string; subtitle: string; description: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState<{ id: number; title: string; subtitle: string; description: string; slug: string } | null>(null);
  const [deletingAdvice, setDeletingAdvice] = useState<number | null>(null);

  const fetchAdvices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('advice')
      .select('id, title, subtitle, slug, description, active')
      .order('id', { ascending: true });
    if (!error && data) setAdvice(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvices();
  }, []);

  const handleEditClick = (item: { id: number; title: string; subtitle: string; description: string; slug: string }) => {
    setEditingAdvice(item);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setEditingAdvice(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this advice?')) return;
    setDeletingAdvice(id);
    await supabase.from('advice').delete().eq('id', id);
    setDeletingAdvice(null);
    fetchAdvices();
  };

  return (
    <>
      <div className={adminStyles.headerContainer}>
        <h2 className={adminStyles.heading}>Advice</h2>
        <div className={adminStyles.countBadge}>
          {loading ? '...' : advice.length}
        </div>
      </div>
      
      <button 
        className={adminStyles.addButton} 
        onClick={() => setShowAddModal(true)}
      >
        Add Advice
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : advice.length === 0 ? (
        <div>No advice found.</div>
      ) : (
        <ul className={adminStyles.list}>
          {advice.map(item => (
            <li key={item.id} className={adminStyles.listItem}>
              <div className={adminStyles.itemHeader}>
                <div className={adminAdvice.title}>{item.title}</div>
                <div className={adminStyles.itemActions}>
                  <button 
                    className={adminStyles.editButton} 
                    onClick={() => handleEditClick(item)}
                    disabled={deletingAdvice === item.id}
                  >
                    Edit
                  </button>
                  <button 
                    className={adminStyles.deleteButton} 
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingAdvice === item.id}
                  >
                    {deletingAdvice === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              <div className={adminAdvice.subtitle}>{item.subtitle}</div>
              <div className={`${adminAdvice.description} rich-editor-item`} dangerouslySetInnerHTML={{ __html: item.description }} />
            </li>
          ))}
        </ul>
      )}

      <AddAdviceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdviceAdded={() => {
          setShowAddModal(false);
          fetchAdvices();
        }}
      />

      <EditAdviceModal
        isOpen={showEditModal}
        onClose={handleEditClose}
        onAdviceUpdated={() => {
          handleEditClose();
          fetchAdvices();
        }}
        advice={editingAdvice}
      />
    </>
  );
} 
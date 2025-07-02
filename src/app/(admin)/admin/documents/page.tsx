'use client';
import adminStyles from '../Admin.module.css';
import adminDocuments from './DocumentsAdmin.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import AddDocumentModal from '../../../../components/forms/DocumentAdd/AddDocumentModal';
import EditDocumentModal from '../../../../components/forms/DocumentEdit/EditDocumentModal';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<{ id: number; title: string; content: string; active: boolean; type: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<{ id: number; title: string; content: string; active: boolean; type: string } | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<number | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('document')
      .select('id, title, content, active, type')
      .order('id', { ascending: true });
    if (!error && data) setDocuments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleEditClick = (item: { id: number; title: string; content: string; active: boolean; type: string }) => {
    setEditingDocument(item);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setEditingDocument(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    setDeletingDocument(id);
    await supabase.from('document').delete().eq('id', id);
    setDeletingDocument(null);
    fetchDocuments();
  };

  return (
    <>
      <div className={adminStyles.headerContainer}>
        <h2 className={adminStyles.heading}>Documents</h2>
        <div className={adminStyles.countBadge}>
          {loading ? '...' : documents.length}
        </div>
      </div>
      
      <button 
        className={adminStyles.addButton} 
        onClick={() => setShowAddModal(true)}
      >
        Add Document
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : documents.length === 0 ? (
        <div>No documents found.</div>
      ) : (
        <ul className={adminStyles.list}>
          {documents.map(item => (
            <li key={item.id} className={adminStyles.listItem}>
              <div className={adminStyles.itemHeader}>
                <div className={adminDocuments.title}>{item.title}</div>
                <div className={adminStyles.itemActions}>
                  <button 
                    className={adminStyles.editButton} 
                    onClick={() => handleEditClick(item)}
                    disabled={deletingDocument === item.id}
                  >
                    Edit
                  </button>
                  <button 
                    className={adminStyles.deleteButton} 
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingDocument === item.id}
                  >
                    {deletingDocument === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              <div className={adminDocuments.type}>{item.type}</div>
              <div className={`${adminDocuments.content} rich-editor-item`} dangerouslySetInnerHTML={{ __html: item.content }} />
              <div className={adminDocuments.status}>Status: {item.active ? 'Active' : 'Inactive'}</div>
            </li>
          ))}
        </ul>
      )}

      <AddDocumentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onDocumentAdded={() => {
          setShowAddModal(false);
          fetchDocuments();
        }}
      />

      <EditDocumentModal
        isOpen={showEditModal}
        onClose={handleEditClose}
        onDocumentUpdated={() => {
          handleEditClose();
          fetchDocuments();
        }}
        document={editingDocument}
      />
    </>
  );
} 
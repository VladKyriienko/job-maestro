'use client';
import adminStyles from '../Admin.module.css';
import adminJobCategories from './JobCategoriesAdmin.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import AddJobCategoryModal from '../../../../components/forms/JobCategoryAdd/AddJobCategoryModal';
import EditJobCategoryModal from '../../../../components/forms/JobCategoryEdit/EditJobCategoryModal';

export default function AdminJobCategoriesPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_categories')
      .select('id, name')
      .order('name', { ascending: true });
    if (!error && data) {
      // Додаткове клієнтське сортування для гарантії алфавітного порядку
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (item: { id: number; name: string }) => {
    setEditingCategory(item);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setEditingCategory(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job category? This may affect existing jobs.')) return;
    setDeletingCategory(id);
    const { error } = await supabase.from('job_categories').delete().eq('id', id);
    setDeletingCategory(null);
    if (error) {
      alert('Failed to delete category. It may be referenced by existing jobs.');
      return;
    }
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <>
      <div className={adminStyles.headerContainer}>
        <h2 className={adminStyles.heading}>Job Categories</h2>
        <div className={adminStyles.countBadge}>
          {loading ? '...' : categories.length}
        </div>
      </div>
        
      <button className={adminStyles.addButton} onClick={() => setShowAddModal(true)}>
        Add Job Category
      </button>

      <AddJobCategoryModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCategoryAdded={fetchCategories}
      />

      <EditJobCategoryModal 
        isOpen={showEditModal}
        onClose={handleEditClose}
        onCategoryUpdated={fetchCategories}
        category={editingCategory}
      />

      {loading ? (
        <div>Loading...</div>
      ) : categories.length === 0 ? (
        <div>No job categories found.</div>
      ) : (
        <ul className={adminStyles.list}>
          {categories.map(item => (
            <li key={item.id} className={adminJobCategories.listItem}>
              <span className={adminJobCategories.categoryName}>{item.name}</span>
              <div className={adminStyles.itemActions}>
                <button className={adminJobCategories.editButton} onClick={() => handleEditClick(item)}>
                  Edit
                </button>
                <button 
                  className={adminStyles.deleteButton} 
                  onClick={() => handleDelete(item.id)} 
                  disabled={deletingCategory === item.id}
                >
                  {deletingCategory === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
} 
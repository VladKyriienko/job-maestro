'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../supabaseClient';
import adminStyles from '../Admin.module.css';
import adminJobs from './JobsAdmin.module.css';
import AddJobModal from '../../../../components/forms/JobAdd/AddJobModal';
import EditJobModal from '../../../../components/forms/JobEdit/EditJobModal';

interface Job {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  salary: number | null;
  hours_per_day: number | null;
  posted_by: string | null;
  job_type: string | null;
  contract_length: number | null;
  contract_type: string | null;
  job_category: string | null;
  active: boolean | null;
  created_at: string | null;
  modified_at: string | null;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<number | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        id, title, description, location, salary, hours_per_day, 
        posted_by, job_type, contract_length, contract_type, job_category, active, created_at, modified_at
      `)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setJobs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleEditClick = (job: Job) => {
    setEditingJob(job);
    setShowEditForm(true);
  };

  const handleEditClose = () => {
    setEditingJob(null);
    setShowEditForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setDeletingJob(id);
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    setDeletingJob(null);
    if (error) {
      alert('Failed to delete job. Please try again.');
      return;
    }
    setEditingJob(null);
    fetchJobs();
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Not specified';
    return `£${salary.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className={adminStyles.headerContainer}>
        <h2 className={adminStyles.heading}>Jobs</h2>
        <div className={adminStyles.countBadge}>
          {loading ? '...' : jobs.length}
        </div>
      </div>
        
        <button 
          onClick={() => setShowAddForm(true)} 
          className={adminStyles.addButton}
        >
          Add New Job
        </button>

        <AddJobModal 
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onJobAdded={() => {
            setShowAddForm(false);
            fetchJobs();
          }}
        />

        <EditJobModal 
          isOpen={showEditForm}
          onClose={handleEditClose}
          onJobUpdated={() => {
            handleEditClose();
            fetchJobs();
          }}
          job={editingJob}
        />

        {loading ? (
          <div className={adminJobs.loading}>Loading jobs...</div>
        ) : (
          <div className={adminStyles.list}>
            {jobs.map((job) => (
              <div key={job.id} className={adminJobs.item}>
                <div className={adminJobs.itemContent}>
                  <div className={adminStyles.itemHeader}>
                    <h3 className={adminJobs.itemTitle}>{job.title}</h3>
                    <div className={adminStyles.itemActions}>
                      <button 
                        onClick={() => handleEditClick(job)} 
                        className={adminStyles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(job.id)} 
                        className={adminStyles.deleteButton}
                        disabled={deletingJob === job.id}
                      >
                        {deletingJob === job.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                  <div className={adminJobs.itemDetails}>
                    <div className={adminJobs.itemRow}>
                      <strong>Location:</strong> {job.location || 'Not specified'}
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Salary:</strong> {formatSalary(job.salary)}
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Hours per Day:</strong> {job.hours_per_day || 'Not specified'}
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Job Type:</strong> {job.job_type ? job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1) : 'Not specified'}
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Contract Length:</strong> {job.contract_length ? `${job.contract_length} month${job.contract_length !== 1 ? 's' : ''}` : 'Not specified'}
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Contract Type:</strong> {job.contract_type || 'Not specified'}
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Job Category:</strong> {job.job_category || 'Not specified'}
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Posted By:</strong> {job.posted_by || 'Unknown'}
                    </div>
                    <div className={`${adminJobs.itemRow} ${adminJobs.fullWidth}`}>
                      <strong>Status:</strong> 
                      <span className={job.active ? adminJobs.statusActive : adminJobs.statusInactive}>
                        {job.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className={adminJobs.itemRow}>
                      <strong>Created:</strong> {formatDate(job.created_at)}
                    </div>
                    {job.modified_at && job.modified_at !== job.created_at && (
                      <div className={adminJobs.itemRow}>
                        <strong>Modified:</strong> {formatDate(job.modified_at)}
                      </div>
                    )}
                    {job.description && (
                      <div className={adminJobs.itemDescription}>
                        <strong>Description:</strong>
                        <div dangerouslySetInnerHTML={{ __html: job.description }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
} 
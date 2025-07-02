'use client';
import { useState, useEffect, use } from 'react';
import { supabase } from '../../../../supabaseClient';
import styles from './job-detail.module.css';
import { notFound } from 'next/navigation';

interface JobDetail {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  salary: number | null;
  job_type: string | null;
  contract_type: string | null;
  contract_length: number | null;
  hours_per_day: number | null;
  job_category: string | null;
  posted_by: string | null;
  created_at: string | null;
  active: boolean | null;
}

interface JobDetailPageProps {
  params: Promise<{
    title: string;
  }>;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const resolvedParams = use(params);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobViews, setJobViews] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Декодуємо title з URL
        const decodedTitle = decodeURIComponent(resolvedParams.title);
        
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('title', decodedTitle)
          .eq('active', true)
          .single();

        if (error) {
          console.error('Error fetching job:', error);
          notFound();
          return;
        }

        setJob(jobData);
        // Симулюємо job views (можна додати реальну логіку збереження в БД)
        setJobViews(Math.floor(Math.random() * 100));
      } catch (error) {
        console.error('Error:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [resolvedParams.title]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    notFound();
    return null; // Add explicit return for TypeScript
  }

  // Форматуємо зарплату
  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Salary not specified';
    return `£${salary} per day`;
  };



  // Форматуємо опис роботи для відображення
  const formatJobDescription = (description: string | null) => {
    if (!description) return '';
    
    // Замінюємо переноси рядків на <br> для правильного відображення
    return description.replace(/\n/g, '<br>');
  };

  // Additional safety check for TypeScript
  if (!job) return null;

  return (
    <div className={styles.container}>
      {/* FindContractJobs Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <div className={styles.logoIcon}>
            <div className={styles.logoCircles}>
              <div className={styles.logoCircle}></div>
              <div className={styles.logoCircle}></div>
              <div className={styles.logoCircle}></div>
              <div className={styles.logoCircle}></div>
            </div>
          </div>
          Find<span>Contract</span>Jobs
        </h1>
      </header>

      {/* Job Header */}
      <div className={styles.jobHeader}>
        <div className={styles.jobHeaderContent}>
          <div className={styles.jobMainInfo}>
            <h1 className={styles.jobTitle}>{job.title}</h1>
            <p className={styles.jobCategory}>{job.job_category || 'Category not specified'}</p>
            <p className={styles.jobLocation}>{job.location}</p>
          </div>
          <div className={styles.jobMetaInfo}>
            <div className={styles.salary}>{formatSalary(job.salary)}</div>
            <div className={styles.jobTypeWrapper}>
              <div className={styles.jobType}>
                {job.job_type ? job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1) : ''}
              </div>
              <div className={styles.contractType}>{job.contract_type}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className={styles.jobContent}>
        <div className={styles.jobDescription}>
          {job.description && (
            <div className={styles.descriptionSection}>
              <div 
                className={styles.descriptionText} 
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.description) }}
              />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className={styles.jobFooter}>
          <div className={styles.recruitmentInfo}>
            <span className={styles.label}>Recruitment Agency:</span>
            <span className={styles.agency}>{job.posted_by || 'Direct Employer'}</span>
          </div>
          <div className={styles.jobMeta}>
            <div className={styles.jobReference}>
              <span className={styles.label}>Job Reference:</span>
              <span className={styles.reference}>{job.id}_{new Date(job.created_at || '').getFullYear()}</span>
            </div>
            <div className={styles.jobViews}>
              <span className={styles.label}>Job Views:</span>
              <span className={styles.views}>{jobViews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
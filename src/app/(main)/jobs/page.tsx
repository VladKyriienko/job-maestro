'use client';

import { Suspense } from 'react';
import styles from './Jobs.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';

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
  active: boolean | null;
  created_at: string | null;
  modified_at: string | null;
}



function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const titleParam = searchParams.get('title') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const locationParam = searchParams.get('location') || '';
  const jobTypeParam = searchParams.get('job_type') || '';
  const locationFilterParam = searchParams.get('location_filter') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');
  
  const [jobTitle, setJobTitle] = useState(titleParam);
  const [keyword, setKeyword] = useState(keywordParam);
  const [location, setLocation] = useState(locationParam);
  const [radius, setRadius] = useState('5 miles');
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [sortBy, setSortBy] = useState('None');

  // Filter states
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [locationTypes, setLocationTypes] = useState<string[]>([]);
  const [contractLengths, setContractLengths] = useState<string[]>([]);
  const [postedFilters, setPostedFilters] = useState<string[]>([]);

  // Collapsible sections state
  const [contractTypeOpen, setContractTypeOpen] = useState(true);
  const [locationTypeOpen, setLocationTypeOpen] = useState(false);
  const [contractLengthOpen, setContractLengthOpen] = useState(false);
  const [postedOpen, setPostedOpen] = useState(false);
  
  const jobsPerPage = 10;

  // Keep inputs in sync if the params change
  useEffect(() => {
    setJobTitle(titleParam);
    setKeyword(keywordParam);
    setLocation(locationParam);
    setCurrentPage(pageParam);
  }, [titleParam, keywordParam, locationParam, jobTypeParam, pageParam]);

  // Auto-activate location filter if location_filter param is present
  useEffect(() => {
    if (locationFilterParam) {
      if (locationFilterParam === 'remote' && !locationTypes.includes('remote')) {
        setLocationTypes(['remote']);
        setLocationTypeOpen(true); // Open the location type section
        
        // Clean up the URL by removing the location_filter param
        const params = new URLSearchParams(window.location.search);
        params.delete('location_filter');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.replace(newUrl);
      } else if (locationFilterParam === 'hybrid' && !locationTypes.includes('hybrid')) {
        setLocationTypes(['hybrid']);
        setLocationTypeOpen(true); // Open the location type section
        
        // Clean up the URL by removing the location_filter param
        const params = new URLSearchParams(window.location.search);
        params.delete('location_filter');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.replace(newUrl);
      }
    }
  }, [locationFilterParam, locationTypes, router]);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      
      const startIndex = (currentPage - 1) * jobsPerPage;
      const endIndex = startIndex + jobsPerPage - 1;
      
      let query = supabase
        .from('jobs')
        .select(`
          id, title, description, location, salary, hours_per_day,
          posted_by, job_type, contract_length, contract_type, active, created_at, modified_at
        `, { count: 'exact' })
        .eq('active', true)
        .range(startIndex, endIndex);

      // Apply filters
      if (titleParam) {
        query = query.ilike('title', `%${titleParam}%`);
      }
      if (keywordParam) {
        query = query.ilike('description', `%${keywordParam}%`);
      }
      if (locationParam) {
        query = query.ilike('location', `%${locationParam}%`);
      }
      if (jobTypeParam) {
        query = query.eq('job_type', jobTypeParam);
      }

      // Apply advanced filters
      if (contractTypes.length > 0) {
        query = query.in('contract_type', contractTypes);
      }
      if (locationTypes.length > 0) {
        query = query.in('job_type', locationTypes);
      }
      if (contractLengths.length > 0) {
        // Build OR conditions for contract length filtering
        const orConditions: string[] = [];
        
        contractLengths.forEach(length => {
          switch (length) {
            case 'Under 3 months':
              // Показувати всі роботи з contract_length < 3 (1, 2 місяці)
              orConditions.push('contract_length.in.(1,2)');
              break;
            case '3 months':
              orConditions.push('contract_length.eq.3');
              break;
            case '4-6 months':
              orConditions.push('contract_length.in.(4,5,6)');
              break;
            case '7-9 months':
              orConditions.push('contract_length.in.(7,8,9)');
              break;
            case '10-12 months':
              orConditions.push('contract_length.in.(10,11,12)');
              break;
            case 'Over 12 months':
              // Показувати всі роботи з contract_length > 12 (13+ місяців)
              orConditions.push('contract_length.in.(13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36)');
              break;
            case 'Ongoing':
              orConditions.push('contract_length.is.null');
              break;
          }
        });
        
        if (orConditions.length > 0) {
          const orQuery = orConditions.join(',');
          console.log('Contract length filter:', contractLengths, '→', orQuery);
          query = query.or(orQuery);
        }
      }
      if (postedFilters.length > 0) {
        let dateFilter = null;
        
        if (postedFilters.includes('Today')) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          dateFilter = today.toISOString();
        } else if (postedFilters.includes('Last 7 days')) {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          dateFilter = sevenDaysAgo.toISOString();
        }
        
        if (dateFilter) {
          query = query.gte('created_at', dateFilter);
        }
      }

      // Apply sorting
      if (sortBy === 'Date Posted') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'Salary') {
        query = query.order('salary', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      // Логування для дебагу contract length
      if (contractLengths.length > 0) {
        console.log('Filtered jobs count:', count);
        console.log('Sample jobs with contract_length:', data?.slice(0, 3).map(job => ({
          id: job.id,
          title: job.title,
          contract_length: job.contract_length,
          contract_length_type: typeof job.contract_length
        })));
      }
      
      setJobs(data || []);
      setTotalJobs(count || 0);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, titleParam, keywordParam, locationParam, jobTypeParam, sortBy, contractTypes, locationTypes, contractLengths, postedFilters]);

  // Load jobs when component mounts or dependencies change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle) params.append('title', jobTitle);
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (jobTypeParam) params.append('job_type', jobTypeParam);
    params.append('page', '1');
    router.push(`/jobs?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (titleParam) params.append('title', titleParam);
    if (keywordParam) params.append('keyword', keywordParam);
    if (locationParam) params.append('location', locationParam);
    if (jobTypeParam) params.append('job_type', jobTypeParam);
    params.append('page', page.toString());
    router.push(`/jobs?${params.toString()}`);
  };

  // Filter handlers
  const handleContractTypeChange = (contractType: string, checked: boolean) => {
    if (checked) {
      setContractTypes([...contractTypes, contractType]);
    } else {
      setContractTypes(contractTypes.filter(type => type !== contractType));
    }
    setCurrentPage(1);
  };

  const handleLocationTypeChange = (locationType: string, checked: boolean) => {
    if (checked) {
      setLocationTypes([...locationTypes, locationType]);
    } else {
      setLocationTypes(locationTypes.filter(type => type !== locationType));
    }
    setCurrentPage(1);
  };

  const handleContractLengthChange = (contractLength: string, checked: boolean) => {
    if (checked) {
      setContractLengths([...contractLengths, contractLength]);
    } else {
      setContractLengths(contractLengths.filter(length => length !== contractLength));
    }
    setCurrentPage(1);
  };

  const handlePostedFilterChange = (postedFilter: string, checked: boolean) => {
    if (checked) {
      setPostedFilters([...postedFilters, postedFilter]);
    } else {
      setPostedFilters(postedFilters.filter(filter => filter !== postedFilter));
    }
    setCurrentPage(1);
  };



  const formatSalary = (salary: number | null) => {
    if (!salary) return '';
    return `£${salary.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getJobTypeDisplay = (jobType: string | null) => {
    if (!jobType) return '';
    return jobType.charAt(0).toUpperCase() + jobType.slice(1);
  };

  const handleJobDetailClick = (jobTitle: string) => {
    // Encode the job title for URL
    const encodedTitle = encodeURIComponent(jobTitle);
    router.push(`/jobs/${encodedTitle}`);
  };

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Previous button
    pages.push(
      <button
        key="prev"
        className={styles.pageNav}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );

    // Page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageNumber} ${i === currentPage ? styles.pageNumberActive : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Ellipsis and last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis" className={styles.pageEllipsis}>...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className={`${styles.pageNumber} ${totalPages === currentPage ? styles.pageNumberActive : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className={styles.pageNav}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );

    return pages;
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
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
        
        <div className={styles.searchBarWrapper}>
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              className={styles.input}
              placeholder="Add a job title"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Add a keyword"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <div className={styles.locationInputWrapper}>
              <span className={styles.locationIcon}>📍</span>
              <input 
                className={styles.locationInput} 
                placeholder="Add a Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <select 
              className={styles.radiusSelect}
              value={radius}
              onChange={e => setRadius(e.target.value)}
            >
              <option>5 miles</option>
              <option>10 miles</option>
              <option>25 miles</option>
              <option>50 miles</option>
            </select>
            <button className={styles.findJobsButton} type="submit">Find jobs</button>
          </form>
        </div>
        
        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <div className={styles.filterBox}>
              {/* Contract Type Filter */}
              <div className={styles.filterGroup}>
                <button 
                  className={styles.filterDropdown}
                  onClick={() => setContractTypeOpen(!contractTypeOpen)}
                >
                  Contract type {contractTypeOpen ? '▲' : '▼'}
                </button>
                {contractTypeOpen && (
                  <div className={styles.filterOptions}>
                    {['Inside iR35', 'Umbrella PAYE', 'Outside iR35'].map(type => (
                      <label key={type} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          checked={contractTypes.includes(type)}
                          onChange={(e) => handleContractTypeChange(type, e.target.checked)}
                          className={styles.filterCheckbox}
                        />
                        <span className={styles.filterLabel}>{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Type Filter */}
              <div className={styles.filterGroup}>
                <button 
                  className={styles.filterDropdown}
                  onClick={() => setLocationTypeOpen(!locationTypeOpen)}
                >
                  Location type {locationTypeOpen ? '▲' : '▼'}
                </button>
                {locationTypeOpen && (
                  <div className={styles.filterOptions}>
                    {['remote', 'onsite', 'hybrid'].map(type => (
                      <label key={type} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          checked={locationTypes.includes(type)}
                          onChange={(e) => handleLocationTypeChange(type, e.target.checked)}
                          className={styles.filterCheckbox}
                        />
                        <span className={styles.filterLabel}>{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Contract Length Filter */}
              <div className={styles.filterGroup}>
                <button 
                  className={styles.filterDropdown}
                  onClick={() => setContractLengthOpen(!contractLengthOpen)}
                >
                  Contract length {contractLengthOpen ? '▲' : '▼'}
                </button>
                {contractLengthOpen && (
                  <div className={styles.filterOptions}>
                    {['Under 3 months', '3 months', '4-6 months', '7-9 months', '10-12 months', 'Over 12 months', 'Ongoing'].map(length => (
                      <label key={length} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          checked={contractLengths.includes(length)}
                          onChange={(e) => handleContractLengthChange(length, e.target.checked)}
                          className={styles.filterCheckbox}
                        />
                        <span className={styles.filterLabel}>{length}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Posted Filter */}
              <div className={styles.filterGroup}>
                <button 
                  className={styles.filterDropdown}
                  onClick={() => setPostedOpen(!postedOpen)}
                >
                  Posted {postedOpen ? '▲' : '▼'}
                </button>
                {postedOpen && (
                  <div className={styles.filterOptions}>
                    {['Today', 'Last 7 days'].map(period => (
                      <label key={period} className={styles.filterOption}>
                        <input
                          type="checkbox"
                          checked={postedFilters.includes(period)}
                          onChange={(e) => handlePostedFilterChange(period, e.target.checked)}
                          className={styles.filterCheckbox}
                        />
                        <span className={styles.filterLabel}>{period}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <button className={styles.netSalaryButton}>Net Salary Settings</button>
            </div>
          </aside>
          
          <section className={styles.jobsSection}>
            <div className={styles.jobsHeader}>
              <span className={styles.jobsCount}>
                Showing {totalJobs} Jobs
              </span>
              <div className={styles.sortBy}>
                Sort by: 
                <select 
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option>None</option>
                  <option>Date Posted</option>
                  <option>Salary</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className={styles.loading}>Loading jobs...</div>
            ) : (
              <div className={styles.jobsList}>
                {jobs.map((job) => (
                  <div key={job.id} className={styles.jobCard}>
                    <div className={styles.jobHeader}>
                      <div className={styles.companyIcon}>
                        <div className={styles.companyIconCircles}>
                          <div className={styles.companyIconCircle}></div>
                          <div className={styles.companyIconCircle}></div>
                          <div className={styles.companyIconCircle}></div>
                          <div className={styles.companyIconCircle}></div>
                        </div>
                      </div>
                      <div className={styles.jobTitleSection}>
                        <h3 className={styles.jobTitle}>{job.title}</h3>
                        <div className={styles.jobMeta}>
                          <span className={styles.jobLocation}>{job.location || 'Location not specified'}</span>
                          <span className={styles.jobType}>{getJobTypeDisplay(job.job_type)}</span>
                        </div>
                      </div>
                      <div className={styles.jobPosted}>
                        Posted: {formatDate(job.created_at)}
                      </div>
                    </div>
                    
                    <div className={styles.jobDetails}>
                      <div className={styles.jobTags}>
                        {job.salary && (
                          <span className={styles.jobTag}>Rate: {formatSalary(job.salary)}</span>
                        )}

                        {job.hours_per_day && (
                          <span className={styles.jobTag}>{job.hours_per_day} hours/day</span>
                        )}
                        {job.contract_type && (
                          <span className={styles.jobTag}>{job.contract_type}</span>
                        )}
                        {job.contract_length && (
                          <span className={styles.jobTag}>{job.contract_length} month{job.contract_length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                      
                      <div className={styles.jobActions}>
                        <button 
                          className={styles.findOutMoreButton}
                          onClick={() => handleJobDetailClick(job.title)}
                        >
                          Find out more
                        </button>
                        <button className={styles.netSalaryCalculatorButton}>Net Salary Calculator</button>
                      </div>
                    </div>
                    
                    {job.posted_by && (
                      <div className={styles.jobFooter}>
                        by {job.posted_by}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
            <div className={styles.pagination}>
                {renderPagination()}
            </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
} 
'use client';
import Image from 'next/image';
import styles from './HomeContent.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

interface JobCategory {
  name: string;
  count: number;
}

interface FeaturedJob {
  id: number;
  company: string;
  companyLogo: string;
  logoColor: string;
  title: string;
  location: string;
  rate: string;
  duration: string;
  remote: boolean;
}

// Функція для підрахунку jobs по категоріях
const countJobsByCategory = async (categoryName: string, jobTypeFilter?: string): Promise<number> => {
  const searchTerm = categoryName.replace(' Jobs', '').toLowerCase();
  
  let query = supabase
    .from('jobs')
    .select('id', { count: 'exact' })
    .eq('active', true)
    .ilike('description', `%${searchTerm}%`);
  
  // Додаємо фільтр по job_type для remote/hybrid jobs
  if (jobTypeFilter) {
    query = query.eq('job_type', jobTypeFilter);
  }
  
  const { count } = await query;
  return count || 0;
};

// Функція для завантаження всіх категорій з підрахунком
const loadJobCategories = async (): Promise<JobCategory[]> => {
  const { data: categories } = await supabase
    .from('job_categories')
    .select('name')
    .order('name');
  
  if (!categories) return [];
  
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const jobName = `${category.name} Jobs`;
      const count = await countJobsByCategory(jobName);
      return { name: jobName, count };
    })
  );
  
  // Сортуємо за алфавітом
  return categoriesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
};

// Функція для завантаження remote job категорій
const loadRemoteJobCategories = async (): Promise<JobCategory[]> => {
  const { data: categories } = await supabase
    .from('job_categories')
    .select('name')
    .order('name');
  
  if (!categories) return [];
  
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const jobName = `${category.name} Jobs`;
      const count = await countJobsByCategory(jobName, 'remote');
      return { name: jobName, count };
    })
  );
  
  // Сортуємо за алфавітом
  return categoriesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
};

// Функція для завантаження hybrid job категорій
const loadHybridJobCategories = async (): Promise<JobCategory[]> => {
  const { data: categories } = await supabase
    .from('job_categories')
    .select('name')
    .order('name');
  
  if (!categories) return [];
  
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const jobName = `${category.name} Jobs`;
      const count = await countJobsByCategory(jobName, 'hybrid');
      return { name: jobName, count };
    })
  );
  
  // Сортуємо за алфавітом
  return categoriesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
};

// Функція для завантаження featured jobs з Supabase
const loadFeaturedJobs = async (): Promise<FeaturedJob[]> => {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('active', true)
    .eq('contract_type', 'Outside iR35')
    .order('created_at', { ascending: false })
    .limit(2);
  
  if (!jobs) return [];
  
  return jobs.map((job, index) => ({
    id: job.id,
    company: job.company || 'Company Name',
    companyLogo: job.company ? job.company.substring(0, 4).toUpperCase() : 'COMP',
    logoColor: index % 2 === 0 ? '#2d3748' : '#dc2626',
    title: job.title || 'Job Title',
    location: job.location || 'Location',
    rate: job.salary || 'Rate not specified',
    duration: job.duration || 'Duration not specified',
    remote: job.job_type === 'remote'
  }));
};

// Функція для підрахунку загальної кількості активних робіт
const loadTotalJobsCount = async (): Promise<number> => {
  const { count } = await supabase
    .from('jobs')
    .select('id', { count: 'exact' })
    .eq('active', true);
  
  return count || 0;
};

export default function HomeContent() {
  const [jobTitle, setJobTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [remoteJobCategories, setRemoteJobCategories] = useState<JobCategory[]>([]);
  const [hybridJobCategories, setHybridJobCategories] = useState<JobCategory[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [totalJobsCount, setTotalJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Завантажуємо дані при монтуванні компонента
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allCategories, remoteCategories, hybridCategories, featuredJobsData, totalJobs] = await Promise.all([
          loadJobCategories(),
          loadRemoteJobCategories(),
          loadHybridJobCategories(),
          loadFeaturedJobs(),
          loadTotalJobsCount()
        ]);
        
        setJobCategories(allCategories);
        setRemoteJobCategories(remoteCategories);
        setHybridJobCategories(hybridCategories);
        setFeaturedJobs(featuredJobsData);
        setTotalJobsCount(totalJobs);
      } catch (error) {
        console.error('Error loading job categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle) params.append('title', jobTitle);
    if (keyword) params.append('keyword', keyword);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleCategoryClick = (categoryName: string, jobType?: string) => {
    const params = new URLSearchParams();
    // Видаляємо " Jobs" з назви категорії для пошуку
    const keyword = categoryName.replace(' Jobs', '');
    params.append('keyword', keyword);
    
    if (jobType) {
      params.append('job_type', jobType);
    }
    
    router.push(`/jobs?${params.toString()}`);
  };

  const handleRemoteCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams();
    // Видаляємо " Jobs" з назви категорії для пошуку
    const keyword = categoryName.replace(' Jobs', '');
    params.append('keyword', keyword);
    // Використовуємо спеціальний параметр для активації Location type фільтра
    params.append('location_filter', 'remote');
    
    router.push(`/jobs?${params.toString()}`);
  };

  const handleHybridCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams();
    // Видаляємо " Jobs" з назви категорії для пошуку
    const keyword = categoryName.replace(' Jobs', '');
    params.append('keyword', keyword);
    // Використовуємо спеціальний параметр для активації Location type фільтра
    params.append('location_filter', 'hybrid');
    
    router.push(`/jobs?${params.toString()}`);
  };

  const handleJobCardClick = (jobTitle: string) => {
    // Encode the job title for URL
    const encodedTitle = encodeURIComponent(jobTitle);
    router.push(`/jobs/${encodedTitle}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <h1 className={styles.title}>
              Discover your <span className={styles.italicText}>perfect</span> contract assignment in a fraction of the time
            </h1>
            <div className={styles.searchContainer}>
              <form className={styles.searchForm} onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Job Title"
                  className={styles.searchInput}
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Keyword"
                  className={styles.searchInput}
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
                <button className={styles.searchButton} type="submit">Search</button>
              </form>
            </div>
            <p className={styles.transparencyText}>
              Enjoy total transparency on rates, contract lengths, iR35 status and more
            </p>
            <h2 className={styles.vacanciesTitle}>
              Search {totalJobsCount} contractor vacancies
            </h2>
            <div className={styles.socialProof}>
              <div className={styles.profilePictures}>
                <div className={styles.profilePic}></div>
                <div className={styles.profilePic}></div>
                <div className={styles.profilePic}></div>
                <div className={styles.profilePic}></div>
                <div className={styles.profilePic}></div>
              </div>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                </div>
                <span className={styles.ratingText}>Loved by over 600 contractors</span>
              </div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageContainer}>
              <div className={styles.floatingJobTitle} style={{top: '15%', right: '10%'}}>Product Analyst</div>
              <div className={styles.floatingJobTitle} style={{top: '25%', right: '75%'}}>UI Designer</div>
              <div className={styles.floatingJobTitle} style={{top: '40%', left: '10%'}}>Data Scientist</div>
              <div className={styles.floatingJobTitle} style={{top: '45%', right: '15%'}}>Business Analyst</div>
              <div className={styles.floatingJobTitle} style={{top: '60%', left: '20%'}}>Project Manager</div>
              <div className={styles.floatingJobTitle} style={{top: '65%', right: '25%'}}>Enterprise Architect</div>
              <div className={styles.floatingJobTitle} style={{bottom: '25%', left: '15%'}}>Scrum Master</div>
              <div className={styles.floatingJobTitle} style={{bottom: '15%', right: '10%'}}>DevOps Engineer</div>
              <div className={styles.heroImage}>
                {/* Placeholder for woman with laptop image */}
                <div className={styles.imagePlaceholder}>
                  <span>Hero Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Popular Searches Section */}
      <div className={styles.popularSearchesSection}>
        <div className={styles.popularSearchesContainer}>
          <div className={styles.popularSearchesHeader}>
            <h2 className={styles.popularSearchesTitle}>Popular Searches</h2>
            <svg className={styles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M430.743 0.844231C422.075 0.299842 317.923 -0.746736 258.645 0.844238C144.552 3.90643 43.2055 11.3918 19.6216 14.1137C-3.96202 16.8356 -4.80274 18.7134 9.2202 19.3939C23.8801 20.1052 48.9419 19.8979 64.2395 18.1966C61.9025 18.9905 60.2121 21.4791 64.2395 20.9186C67.8608 20.4146 197.455 14.7942 205.104 14.7942C212.754 14.7942 232.513 15.4747 239.524 14.7942C246.535 14.1137 413.878 15.7075 425.006 15.8149C443.287 15.9914 449.025 15.9914 450.503 15.4747C452.918 14.6304 446.679 10.4845 443.492 9.01007C451.573 10.2073 452.849 9.52679 451.573 7.82559C449.195 4.65076 441.578 1.52472 430.743 0.844231Z" fill="#FFD75E" fillOpacity="0.8"/>
            </svg>
          </div>
          <div className={styles.jobCategoriesGrid}>
            {loading ? (
              <div>Loading job categories...</div>
            ) : (
              jobCategories.map((category: JobCategory, index: number) => (
                <div 
                  key={index} 
                  className={styles.jobCategoryItem}
                  onClick={() => handleCategoryClick(category.name)}
                  style={{ cursor: 'pointer' }}
                >
                <span className={styles.jobCategoryName}>{category.name}</span>
                <span className={styles.jobCategoryCount}>{category.count}</span>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Featured Outside iR35 Jobs Section */}
      <div className={styles.featuredJobsSection}>
        <div className={styles.featuredJobsContainer}>
          <div className={styles.featuredJobsHeader}>
            <h2 className={styles.featuredJobsTitle}>Featured Outside iR35 Jobs</h2>
            <svg className={styles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M430.743 0.844231C422.075 0.299842 317.923 -0.746736 258.645 0.844238C144.552 3.90643 43.2055 11.3918 19.6216 14.1137C-3.96202 16.8356 -4.80274 18.7134 9.2202 19.3939C23.8801 20.1052 48.9419 19.8979 64.2395 18.1966C61.9025 18.9905 60.2121 21.4791 64.2395 20.9186C67.8608 20.4146 197.455 14.7942 205.104 14.7942C212.754 14.7942 232.513 15.4747 239.524 14.7942C246.535 14.1137 413.878 15.7075 425.006 15.8149C443.287 15.9914 449.025 15.9914 450.503 15.4747C452.918 14.6304 446.679 10.4845 443.492 9.01007C451.573 10.2073 452.849 9.52679 451.573 7.82559C449.195 4.65076 441.578 1.52472 430.743 0.844231Z" fill="#FFD75E" fillOpacity="0.8"/>
            </svg>
          </div>
          <div className={styles.jobCardsGrid}>
            {loading ? (
              <div>Loading featured jobs...</div>
            ) : (
              featuredJobs.map((job: FeaturedJob) => (
                <div key={job.id} className={styles.jobCard} onClick={() => handleJobCardClick(job.title)}>
                  <div className={styles.jobCardHeader}>
                    <div className={styles.companyLogo} style={{backgroundColor: job.logoColor}}>
                      <span className={styles.logoText}>{job.companyLogo}</span>
                    </div>
                    <div className={styles.jobDetails}>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.companyName}>by {job.company}</p>
                    </div>
                  </div>
                  <div className={styles.jobMeta}>
                    {job.remote && (
                      <span className={styles.remoteTag}>remote</span>
                    )}
                    <div className={styles.jobInfo}>
                      <span className={styles.jobLocation}>
                        <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className={styles.jobRate}>
                        <svg className={styles.rateIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Rate: {job.rate}
                      </span>
                    </div>
                  </div>
                  <div className={styles.jobDuration}>{job.duration}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Popular Remote Searches Section */}
      <div className={styles.remoteSearchesSection}>
        <div className={styles.remoteSearchesContainer}>
          <div className={styles.remoteSearchesHeader}>
            <h2 className={styles.remoteSearchesTitle}>Popular Remote Searches</h2>
            <svg className={styles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M430.743 0.844231C422.075 0.299842 317.923 -0.746736 258.645 0.844238C144.552 3.90643 43.2055 11.3918 19.6216 14.1137C-3.96202 16.8356 -4.80274 18.7134 9.2202 19.3939C23.8801 20.1052 48.9419 19.8979 64.2395 18.1966C61.9025 18.9905 60.2121 21.4791 64.2395 20.9186C67.8608 20.4146 197.455 14.7942 205.104 14.7942C212.754 14.7942 232.513 15.4747 239.524 14.7942C246.535 14.1137 413.878 15.7075 425.006 15.8149C443.287 15.9914 449.025 15.9914 450.503 15.4747C452.918 14.6304 446.679 10.4845 443.492 9.01007C451573 10.2073 452.849 9.52679 451.573 7.82559C449.195 4.65076 441.578 1.52472 430.743 0.844231Z" fill="#FFD75E" fillOpacity="0.8"/>
            </svg>
          </div>
          <div className={styles.remoteJobCategoriesGrid}>
            {loading ? (
              <div>Loading remote job categories...</div>
            ) : (
              remoteJobCategories.map((category: JobCategory, index: number) => (
                <div 
                  key={index} 
                  className={styles.remoteJobCategoryItem}
                  onClick={() => handleRemoteCategoryClick(category.name)}
                  style={{ cursor: 'pointer' }}
                >
                <span className={styles.remoteJobCategoryName}>{category.name}</span>
                <span className={styles.remoteJobCategoryCount}>{category.count}</span>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Popular Hybrid Searches Section */}
      <div className={styles.hybridSearchesSection}>
        <div className={styles.hybridSearchesContainer}>
          <div className={styles.hybridSearchesHeader}>
            <h2 className={styles.hybridSearchesTitle}>Popular Hybrid Searches</h2>
            <svg className={styles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M430.743 0.844231C422.075 0.299842 317.923 -0.746736 258.645 0.844238C144.552 3.90643 43.2055 11.3918 19.6216 14.1137C-3.96202 16.8356 -4.80274 18.7134 9.2202 19.3939C23.8801 20.1052 48.9419 19.8979 64.2395 18.1966C61.9025 18.9905 60.2121 21.4791 64.2395 20.9186C67.8608 20.4146 197.455 14.7942 205.104 14.7942C212.754 14.7942 232.513 15.4747 239.524 14.7942C246.535 14.1137 413.878 15.7075 425.006 15.8149C443.287 15.9914 449.025 15.9914 450.503 15.4747C452.918 14.6304 446.679 10.4845 443.492 9.01007C451.573 10.2073 452.849 9.52679 451.573 7.82559C449.195 4.65076 441.578 1.52472 430.743 0.844231Z" fill="#FFD75E" fillOpacity="0.8"/>
            </svg>
          </div>
          <div className={styles.hybridJobCategoriesGrid}>
            {loading ? (
              <div>Loading hybrid job categories...</div>
            ) : (
              hybridJobCategories.map((category: JobCategory, index: number) => (
                <div 
                  key={index} 
                  className={styles.hybridJobCategoryItem}
                  onClick={() => handleHybridCategoryClick(category.name)}
                  style={{ cursor: 'pointer' }}
                >
                <span className={styles.hybridJobCategoryName}>{category.name}</span>
                <span className={styles.hybridJobCategoryCount}>{category.count}</span>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Find the right match Section */}
      <section className={styles.matchSection}>
        <div className={styles.matchSubtitle}>
          Full transparency on rates, contract lengths, iR35 status and more, before you apply!
        </div>
        <div className={styles.matchHeadlineContainer}>
          <h2 className={styles.matchHeadline}>Find the right match!</h2>
          <svg className={styles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M430.743 0.844231C422.075 0.299842 317.923 -0.746736 258.645 0.844238C144.552 3.90643 43.2055 11.3918 19.6216 14.1137C-3.96202 16.8356 -4.80274 18.7134 9.2202 19.3939C23.8801 20.1052 48.9419 19.8979 64.2395 18.1966C61.9025 18.9905 60.2121 21.4791 64.2395 20.9186C67.8608 20.4146 197.455 14.7942 205.104 14.7942C212.754 14.7942 232.513 15.4747 239.524 14.7942C246.535 14.1137 413.878 15.7075 425.006 15.8149C443.287 15.9914 449.025 15.9914 450.503 15.4747C452.918 14.6304 446.679 10.4845 443.492 9.01007C451.573 10.2073 452.849 9.52679 451.573 7.82559C449.195 4.65076 441.578 1.52472 430.743 0.844231Z" fill="#FFD75E" fillOpacity="0.8"/>
          </svg>
        </div>
        <div className={styles.matchCardsGrid}>
          {/* Employers & Recruiters Card */}
          <div className={styles.matchCard}>
            <div className={styles.matchCardText}>
              <h3 className={styles.matchCardTitle}>Employers & Recruiters</h3>
              <p className={styles.matchCardDesc}>
                Find the right freelance professional for your next interim position, with CV search and FREE job posting.
              </p>
              <button className={styles.matchCardButtonDisabled} disabled>Coming soon</button>
            </div>
            <div className={styles.matchCardImageWrapper}>
              <Image 
                className={styles.matchCardImage} 
                src="/employers-placeholder.png" 
                alt="Employers & Recruiters"
                width={400}
                height={300}
              />
            </div>
          </div>
          {/* Jobseekers Card */}
          <div className={styles.matchCard}>
            <div className={styles.matchCardText}>
              <h3 className={styles.matchCardTitle}>Jobseekers</h3>
              <p className={styles.matchCardDesc}>
                Find the perfect role you really want in a fraction of the time, using our NEW match rating feature!
              </p>
              <button className={styles.matchCardButton}>Find jobs now</button>
            </div>
            <div className={styles.matchCardImageWrapper}>
              <Image 
                className={styles.matchCardImage} 
                src="/jobseekers-placeholder.png" 
                alt="Jobseekers"
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 
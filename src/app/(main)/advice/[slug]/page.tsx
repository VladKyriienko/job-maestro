'use client';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import slugStyles from './advice-slug.module.css';
import { supabase } from '../../../../supabaseClient';

interface JobCategory {
  name: string;
  count: number;
}

// Функція для підрахунку jobs по категоріях
const countJobsByCategory = async (categoryName: string): Promise<number> => {
  const searchTerm = categoryName.replace(' Jobs', '').toLowerCase();
  
  const { count } = await supabase
    .from('jobs')
    .select('id', { count: 'exact' })
    .eq('active', true)
    .ilike('description', `%${searchTerm}%`);
  
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

export default function AdviceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const [adviceData, setAdviceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    
    const fetchAdvice = async () => {
      const { data, error } = await supabase
        .from('advice')
        .select('title, subtitle, description')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        notFound();
      }

      setAdviceData(data);
      setLoading(false);
    };

    fetchAdvice();
  }, [slug]);

  useEffect(() => {
    const loadData = async () => {
      setCategoriesLoading(true);
      try {
        const categories = await loadJobCategories();
        setJobCategories(categories);
      } catch (error) {
        console.error('Error loading job categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    const searchTerm = categoryName.replace(' Jobs', '');
    const encodedTerm = encodeURIComponent(searchTerm);
    router.push(`/jobs?keyword=${encodedTerm}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!adviceData) {
    notFound();
  }

  return (
    <>
      <div className={slugStyles.pageContainer}>
        <div className={slugStyles.detailContainer}>
          <h2 className={slugStyles.subtitle}>{adviceData.subtitle}</h2>
          <div className={`${slugStyles.description} rich-editor-item white-text`} dangerouslySetInnerHTML={{ __html: adviceData.description }} />
        </div>
        
        {/* Popular Searches Section */}
        <div className={slugStyles.popularSearchesSection}>
          <div className={slugStyles.popularSearchesContainer}>
            <div className={slugStyles.popularSearchesHeader}>
              <h2 className={slugStyles.popularSearchesTitle}>Popular Searches</h2>
              <svg className={slugStyles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M430.743 0.844231C422.075 0.299842 317.923 -0.746736 258.645 0.844238C144.552 3.90643 43.2055 11.3918 19.6216 14.1137C-3.96202 16.8356 -4.80274 18.7134 9.2202 19.3939C23.8801 20.1052 48.9419 19.8979 64.2395 18.1966C61.9025 18.9905 60.2121 21.4791 64.2395 20.9186C67.8608 20.4146 197.455 14.7942 205.104 14.7942C212.754 14.7942 232.513 15.4747 239.524 14.7942C246.535 14.1137 413.878 15.7075 425.006 15.8149C443.287 15.9914 449.025 15.9914 450.503 15.4747C452.918 14.6304 446.679 10.4845 443.492 9.01007C451.573 10.2073 452.849 9.52679 451.573 7.82559C449.195 4.65076 441.578 1.52472 430.743 0.844231Z" fill="#FFD75E" fillOpacity="0.8"/>
              </svg>
            </div>
            <div className={slugStyles.jobCategoriesGrid}>
              {categoriesLoading ? (
                <div>Loading job categories...</div>
              ) : (
                jobCategories.map((category: JobCategory, index: number) => (
                  <div 
                    key={index} 
                    className={slugStyles.jobCategoryItem}
                    onClick={() => handleCategoryClick(category.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className={slugStyles.jobCategoryName}>{category.name}</span>
                    <span className={slugStyles.jobCategoryCount}>{category.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
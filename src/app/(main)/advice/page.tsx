'use client';
import styles from './Advice.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import Link from 'next/link';

export default function AdvicePage() {
  const [advice, setAdvice] = useState<{ id: number; title: string; subtitle: string; description: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('advice')
        .select('id, title, subtitle, description, slug')
        .order('id', { ascending: true });
      if (!error && data) setAdvice(data);
      setLoading(false);
    };
    fetchAdvice();
  }, []);

  // Filter advice by debounced search (case-insensitive)
  const filteredAdvice = advice.filter(item =>
    item.title.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      
      
      {/* Main content with gradient background */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Title */}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              Advice for UK Contractors
            </h1>
            <svg className={styles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M430.743 0.844231C422.075 0.299842 317.923 -0.746736 258.645 0.844238C144.552 3.90643 43.2055 11.3918 19.6216 14.1137C-3.96202 16.8356 -4.80274 18.7134 9.2202 19.3939C23.8801 20.1052 48.9419 19.8979 64.2395 18.1966C61.9025 18.9905 60.2121 21.4791 64.2395 20.9186C67.8608 20.4146 197.455 14.7942 205.104 14.7942C212.754 14.7942 232.513 15.4747 239.524 14.7942C246.535 14.1137 413.878 15.7075 425.006 15.8149C443.287 15.9914 449.025 15.9914 450.503 15.4747C452.918 14.6304 446.679 10.4845 443.492 9.01007C451.573 10.2073 452.849 9.52679 451.573 7.82559C449.195 4.65076 441.578 1.52472 430.743 0.844231Z" fill="#FFD75E" fillOpacity="0.8"/>
            </svg>
          </div>

          {/* Search Bar */}
          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <label htmlFor="advice-search" style={{position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'}}>Topic</label>
              <div className={styles.searchIconWrapper}>
                <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="advice-search"
                type="text"
                placeholder="Topic"
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Advice Cards Grid */}
          <div className={styles.cardsGrid}>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : filteredAdvice.length === 0 ? (
              <div className={styles.empty}>No advice found.</div>
            ) : (
              <ul className={styles.cardList}>
                {filteredAdvice.map(item => (
                  <li key={item.id} className={`${styles.card} ${styles.cardGreen600}`}>
                    <Link href={`/advice/${item.slug}`} className={styles.cardLink}>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardSubtitle}>{item.subtitle}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      
    
    </div>
  );
} 
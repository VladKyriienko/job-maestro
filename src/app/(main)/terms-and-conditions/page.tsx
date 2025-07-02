'use server';

import styles from './TermsAndConditions.module.css';
import { supabase } from '../../../supabaseClient';

export default async function TermsAndConditions({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const typeParam = params?.type;
  let typeValue = typeParam;
  if (typeParam === 'jobseeker') typeValue = 'Jobseeker Terms and Conditions';
  else if (typeParam === 'advertiser') typeValue = 'Advertiser Terms and Conditions';

  let doc = null;
  let error = '';
  if (typeValue) {
    const { data, error: dbError } = await supabase
      .from('document')
      .select('title, content')
      .eq('type', typeValue)
      .eq('active', true)
      .limit(1)
      .single();
    if (dbError) {
      error = 'Could not load document.';
    } else {
      doc = data;
    }
  }

  let content;
  let title = 'Terms and Conditions';

  if (error) {
    content = <div className={styles.text}>{error}</div>;
  } else if (doc) {
    title = doc.title;
            content = <div className={`${styles.contentHtml} rich-editor-item policy-content`} dangerouslySetInnerHTML={{ __html: doc.content }} />;
  } else {
    content = <div className={styles.text}>Document not found.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
          <h1 className={styles.title}>{title}</h1>
          {content}
      </main>
    </div>
  );
} 
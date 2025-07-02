'use server';

import styles from './PrivacyPolicy.module.css';
import { supabase } from '../../../supabaseClient';

export default async function PrivacyPolicy() {
  let doc = null;
  let error = '';
  const { data, error: dbError } = await supabase
    .from('document')
    .select('title, content')
    .eq('type', 'Privacy Policy')
    .eq('active', true)
    .limit(1)
    .single();
  if (dbError) {
    error = 'Could not load document.';
  } else {
    doc = data;
  }

  let content;
  let title = 'Privacy Policy';

  if (error) {
    content = <div className={styles.text}>{error}</div>;
  } else if (doc) {
    title = doc.title;
            content = <div className={`${styles.contentHtml} rich-editor-item policy-content`} dangerouslySetInnerHTML={{ __html: doc.content }} />;
  } else {
    content = <></>;
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          {content}
        </div>
      </main>
    </div>
  );
} 
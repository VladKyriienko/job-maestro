'use client';

import { useState, useEffect } from 'react';

import styles from './Faqs.module.css';
import { supabase } from '@/supabaseClient';

export default function FAQs() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<{ id: number; question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .order('id', { ascending: true });
      if (!error && data) {
        setFaqs(data);
      }
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  return (
    <div className={styles.pageContainer}>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Title */}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              FAQs
            </h1>
            <svg className={styles.titleDecorator} viewBox="0 0 451 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M123.325 1.84107C120.821 1.28659 90.9164 0.111146 73.967 1.62571C41.3442 4.54084 12.5203 11.8889 5.84456 14.5775C-0.83115 17.2661 -1.01152 19.1401 3.03226 19.8372C7.25974 20.5659 14.4407 20.3902 18.773 18.7105C18.1284 19.5003 17.7242 21.9833 18.8611 21.4286C19.8834 20.9299 56.8691 15.4796 59.0629 15.4892C61.2567 15.4987 66.9457 16.203 68.9344 15.5322C70.9232 14.8615 118.968 16.6624 122.164 16.7836C127.412 16.9827 129.058 16.9899 129.465 16.4758C130.13 15.6357 128.207 11.4878 127.245 10.0114C129.602 11.2171 129.945 10.5391 129.525 8.83871C128.74 5.66536 126.454 2.53416 123.325 1.84107Z" fill="#FFD75E" fillOpacity="0.8"/>
            </svg>
          </div>

          {/* FAQ Cards */}
          <div className={styles.faqContainer}>
            {loading ? (
              <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Loading...</div>
            ) : faqs.length === 0 ? (
              <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>No FAQs found.</div>
            ) : faqs.map((faq, index) => (
              <div 
                key={faq.id}
                className={`${styles.faqCard} ${expandedCard === index ? styles.expanded : ''}`}
                onClick={() => toggleCard(index)}
              >
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                {expandedCard === index && (
                  <div className={styles.faqAnswer}>
                    <p className={styles.answerText}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
 
    </div>
  );
} 
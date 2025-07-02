import HomeContent from '../../components/pages/HomePage/HomeContent';
import styles from '../../components/pages/HomePage/HomeContent.module.css';

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <HomeContent />
    </div>
  );
}

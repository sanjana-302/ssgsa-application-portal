import Footer from '../components/Footer'
import Header from '../components/Header'
import styles from '../styles/Home.module.css'

export default function MainLayout({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      <div className="px-2 sm:px-5 md:px-10 lg:px-20 xl:px-40 overflow-x-hidden">
        {children}
      </div>
      <Footer />
    </div>
  )
}

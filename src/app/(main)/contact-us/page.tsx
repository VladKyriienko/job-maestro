
import Link from 'next/link';
import styles from './ContactUs.module.css';

export default function ContactUs() {
  return (
    <div className={styles.pageContainer}>
   
      
      <main className={styles.main}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Get in touch with our team. We are here to help with any questions or concerns.
          </p>
        </div>

        <div className={styles.contentGrid}>
          {/* Contact Form */}
          <div className={styles.formSection}>
            <h2 className={styles.formTitle}>Send us a Message</h2>
            
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className={styles.input}
                    placeholder="Your first name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className={styles.input}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={styles.input}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className={styles.select}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="job-seeker">Job Seeker Support</option>
                  <option value="employer">Employer Support</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className={styles.textarea}
                  placeholder="Please describe your question or concern in detail..."
                ></textarea>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
              >
                Send Message
              </button>

              <p className={styles.formNote}>
                * Required fields. We will respond to your message within 24 hours during business days.
              </p>
            </form>
          </div>

          {/* Contact Information */}
          <div className={styles.contactInfo}>
            {/* Office Information */}
            <div className={styles.infoSection}>
              <h2 className={styles.infoTitle}>Get in Touch</h2>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={`${styles.iconWrapper} ${styles.iconWrapperTeal}`}>
                    <svg className={`${styles.icon} ${styles.iconTeal}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3>Address</h3>
                    <p>
                      123 Job Street, Suite 400<br/>
                      Employment City, EC 12345<br/>
                      United States
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={`${styles.iconWrapper} ${styles.iconWrapperBlue}`}>
                    <svg className={`${styles.icon} ${styles.iconBlue}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3>Phone</h3>
                    <p>
                      Main: 1-800-JOBS-123<br/>
                      Support: 1-800-HELP-456<br/>
                      Fax: 1-800-FAX-789
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={`${styles.iconWrapper} ${styles.iconWrapperGreen}`}>
                    <svg className={`${styles.icon} ${styles.iconGreen}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3>Email</h3>
                    <p>
                      General: info@findcontractjobs.com<br/>
                      Support: support@findcontractjobs.com<br/>
                      Business: business@findcontractjobs.com
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={`${styles.iconWrapper} ${styles.iconWrapperPurple}`}>
                    <svg className={`${styles.icon} ${styles.iconPurple}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className={styles.infoContent}>
                    <h3>Business Hours</h3>
                    <p>
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br/>
                      Saturday: 10:00 AM - 4:00 PM EST<br/>
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.quickLinksSection}>
              <h3 className={styles.quickLinksTitle}>Quick Links</h3>
              <div className={styles.quickLinksList}>
                <a href="#" className={styles.quickLink}>
                  Submit a Bug Report
                </a>
                <a href="#" className={styles.quickLink}>
                  Feature Request
                </a>
                <a href="#" className={styles.quickLink}>
                  Employer Resources
                </a>
                <a href="#" className={styles.quickLink}>
                  Job Seeker Resources
                </a>
                <Link href="/faqs" className={styles.quickLink}>
                  Frequently Asked Questions
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className={styles.followSection}>
              <h3 className={styles.followTitle}>Follow Us</h3>
              <div className={styles.followLinks}>
                <a href="#" className={`${styles.followLink} ${styles.followLinkLinkedIn}`}>
                  <span className={styles.srOnly}>LinkedIn</span>
                  <svg className={styles.followIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className={`${styles.followLink} ${styles.followLinkTwitter}`}>
                  <span className={styles.srOnly}>Twitter</span>
                  <svg className={styles.followIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className={`${styles.followLink} ${styles.followLinkGitHub}`}>
                  <span className={styles.srOnly}>GitHub</span>
                  <svg className={styles.followIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      

    </div>
  );
} 
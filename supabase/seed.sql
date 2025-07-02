-- Insert test job categories
INSERT INTO job_categories (name) VALUES 
('Software Development'),
('Data Science'),
('Marketing'),
('Sales'),
('Design');

-- Insert test FAQs
INSERT INTO faqs (question, answer) VALUES 
('How do I create an account?', 'Click on the Sign Up button and fill in your details.'),
('How do I upload my resume?', 'You can upload your resume during registration or later in your profile.'),
('How do I search for jobs?', 'Use the Jobs page to browse available positions.');

-- Insert test advice
INSERT INTO advise (title, subtitle, description, slug) VALUES 
('How to Write a Great CV', 'Tips for creating an impressive resume', 'A comprehensive guide to writing a CV that stands out from the crowd.', 'how-to-write-great-cv'),
('Interview Preparation', 'Ace your next job interview', 'Essential tips and strategies for successful job interviews.', 'interview-preparation');

-- Insert test documents
INSERT INTO document (title, content, type, active) VALUES 
('Privacy Policy', 'This is our privacy policy content...', 'Privacy Policy', true),
('Terms and Conditions', 'These are our terms and conditions...', 'Terms and Conditions', true); 
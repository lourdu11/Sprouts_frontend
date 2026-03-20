import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaRobot, FaLaptopCode, FaUsers, FaFlask, FaPython, FaJava, FaDatabase, FaChartBar, FaChartPie } from 'react-icons/fa';
import { FiCpu, FiCode, FiTrendingUp, FiAward } from 'react-icons/fi';
import TiltCard from '../components/TiltCard';
import './Services.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: (typeof i === 'number' ? i : 0) * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const wordReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

import aiTrainingImg from '../assets/services/ai-training.png';
import aiAutomationImg from '../assets/services/ai-automation.png';
import webAiDevImg from '../assets/services/web-ai-dev.png';
import aiFreelanceImg from '../assets/services/ai-freelance.png';
import innovationLabImg from '../assets/services/innovation-lab.png';

const servicesList = [
  { image: aiTrainingImg, title: 'AI Training Programs', desc: 'Courses in AI, Data Science, ML, DL, and Python.' },
  { image: aiAutomationImg, title: 'AI Automation Services', desc: 'Chatbots, WhatsApp automation, and business AI solutions.' },
  { image: webAiDevImg, title: 'Web & AI Product Development', desc: 'AI-powered applications and tools.' },
  { image: aiFreelanceImg, title: 'AI Freelance Hub', desc: 'Real project opportunities for students and freelancers.' },
  { image: innovationLabImg, title: 'Innovation Lab Programs', desc: 'AI labs and industry exposure for colleges.' },
];

const courses = [
  { icon: <FaBrain />, name: 'Artificial Intelligence' },
  { icon: <FiTrendingUp />, name: 'Data science' },
  { icon: <FaRobot />, name: 'Machine learning' },
  { icon: <FiCpu />, name: 'Deeplearning' },
  { icon: <FaPython />, name: 'Python programming, Java, C programming' },
  { icon: <FaLaptopCode />, name: 'Full stack' },
  { icon: <FaDatabase />, name: 'Sql, Powerbi, Tableue – Data Analytics' },
  { icon: <FaRobot />, name: 'Robotics and IoT' },
  { icon: <FiAward />, name: 'Career and placement supports' },
];

export default function Services() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const splitTitle = "What We Offer".split(" ");

  return (
    <div className="services-page">
      <section className="page-hero section-alt">
        <div className="container">
          <motion.span className="badge badge-blue" variants={fadeUp} initial="hidden" animate="visible" custom={0}>Our Services</motion.span>
          
          <motion.h1 className="section-title" variants={staggerContainer} initial="hidden" animate="visible">
            {splitTitle.map((word, i) => (
              <motion.span key={i} variants={wordReveal} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                {word === "Offer" ? <span className="gradient-text">{word}</span> : word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p className="section-subtitle" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Comprehensive AI education and IT solutions for students and businesses
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-main-grid">
            {servicesList.map((s, i) => (
              <TiltCard key={s.title}>
                <motion.div
                  className="card service-detail-card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <div className="sd-image-wrapper">
                    <img src={s.image} alt={s.title} className="sd-image" />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">Courses <span className="gradient-text">Provided</span></h2>
            <p className="section-subtitle">Master the skills that matter with our comprehensive course catalog</p>
          </motion.div>
          <div className="courses-grid">
            {courses.map((c, i) => (
              <motion.div
                key={c.name}
                className="course-chip"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ scale: 1.06, y: -3 }}
              >
                <span className="course-chip-icon">{c.icon}</span>
                <span>{c.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

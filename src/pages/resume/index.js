import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  meta,
  introdata,
  dataabout,
  worktimeline,
  qualifications,
  skills,
  services,
  training,
  contactConfig,
  socialprofils,
} from "../../content_option";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Section = ({ children, ...props }) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const Resume = () => {
  return (
    <HelmetProvider>
      <Container className="Resume-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Resume | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Resume</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* Identity / Contact */}
        <Section className="rv_section">
          <motion.div variants={fadeUp} className="rv_identity">
            <h2 className="rv_name">{introdata.title}</h2>
            <p className="rv_role">Civil &amp; Project Engineer</p>
            <div className="rv_contact_row">
              <span>{contactConfig.YOUR_EMAIL}</span>
              <span>{contactConfig.YOUR_FONE}</span>
              <a href={socialprofils.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={socialprofils.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </motion.div>
        </Section>

        {/* Professional Summary */}
        <Section className="rv_section">
          <motion.h3 variants={fadeUp} className="rv_section_title">Professional Summary</motion.h3>
          <motion.p variants={fadeUp} className="rv_body_text">{dataabout.aboutme}</motion.p>
        </Section>

        {/* Work Experience */}
        <Section className="rv_section">
          <motion.h3 variants={fadeUp} className="rv_section_title">Work Experience</motion.h3>
          {worktimeline.map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="rv_timeline_item">
              <div className="rv_tl_left">
                <span className="rv_tl_date">{item.date}</span>
              </div>
              <div className="rv_tl_right">
                <h5 className="rv_tl_title">{item.jobtitle}</h5>
                <p className="rv_tl_where">{item.where}</p>
              </div>
            </motion.div>
          ))}
        </Section>

        {/* Education */}
        <Section className="rv_section">
          <motion.h3 variants={fadeUp} className="rv_section_title">Education</motion.h3>
          {qualifications.map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="rv_timeline_item">
              <div className="rv_tl_left">
                <span className="rv_tl_date">{item.country}</span>
              </div>
              <div className="rv_tl_right">
                <h5 className="rv_tl_title">{item.degree}</h5>
                <p className="rv_tl_where">{item.university}</p>
              </div>
            </motion.div>
          ))}
        </Section>

        {/* Core Skills */}
        <Section className="rv_section">
          <motion.h3 variants={fadeUp} className="rv_section_title">Core Skills</motion.h3>
          <motion.div variants={fadeUp} className="rv_skills_grid">
            {skills.map((item, i) => (
              <span key={i} className="rv_skill_tag">{item.name}</span>
            ))}
          </motion.div>
        </Section>

        {/* Areas of Expertise */}
        <Section className="rv_section">
          <motion.h3 variants={fadeUp} className="rv_section_title">Areas of Expertise</motion.h3>
          <Row>
            {services.map((item, i) => (
              <Col key={i} md="6" className="mb-3">
                <motion.div variants={fadeUp} className="rv_service_card">
                  <h5 className="rv_service_title">{item.title}</h5>
                  <p className="rv_service_desc">{item.description}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Section>

        {/* Professional Memberships */}
        <Section className="rv_section">
          <motion.h3 variants={fadeUp} className="rv_section_title">Professional Memberships</motion.h3>
          <motion.ul variants={fadeUp} className="rv_membership_list">
            <li>Engineers Ireland (MIEI, AEng.) — Member since 2022</li>
            <li>Engineers Without Borders — Member since 2020</li>
            <li>Equality, Diversity and Inclusivity (EDI) Committee Member</li>
          </motion.ul>
        </Section>

        {/* Training & CPD */}
        <Section className="rv_section rv_last">
          <motion.h3 variants={fadeUp} className="rv_section_title">Training &amp; CPD</motion.h3>
          <motion.div variants={fadeUp} className="rv_skills_grid">
            {training.map((item, i) => (
              <span key={i} className="rv_skill_tag">{item}</span>
            ))}
          </motion.div>
        </Section>

      </Container>
    </HelmetProvider>
  );
};

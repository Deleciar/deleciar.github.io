import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  services,
  qualifications,
} from "../../content_option";
import AboutBackground from "../../components/AboutBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const About = () => {
  return (
    <HelmetProvider>
      <div className="about-page">
        <AboutBackground />
        <div className="ab-content">
          <Container className="About-header">
            <Helmet>
              <meta charSet="utf-8" />
              <title> About | {meta.title}</title>
              <meta name="description" content={meta.description} />
            </Helmet>

            <Row className="mb-5 mt-3 pt-md-3">
              <Col lg="8">
                <h1 className="display-4 mb-4">About me</h1>
                <hr className="t_border my-4 ml-0 text-left" />
              </Col>
            </Row>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <Row className="sec_sp">
                <Col lg="5">
                  <motion.h3 variants={fadeUp} className="color_sec py-4">{dataabout.title}</motion.h3>
                </Col>
                <Col lg="7" className="d-flex align-items-center">
                  <motion.div variants={fadeUp}>
                    <p>{dataabout.aboutme}</p>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <Row className="sec_sp">
                <Col lg="5">
                  <motion.h3 variants={fadeUp} className="color_sec py-4">Qualifications</motion.h3>
                </Col>
                <Col lg="7">
                  <motion.div variants={fadeUp}>
                    <table className="table caption-top">
                      <tbody>
                        {qualifications.map((data, i) => (
                          <tr key={i}>
                            <th scope="row">{data.degree}</th>
                            <td>{data.university}</td>
                            <td>{data.country}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <Row className="sec_sp">
                <Col lg="5">
                  <motion.h3 variants={fadeUp} className="color_sec py-4">Work Timeline</motion.h3>
                </Col>
                <Col lg="7">
                  <motion.div variants={fadeUp}>
                    <table className="table caption-top">
                      <tbody>
                        {worktimeline.map((data, i) => (
                          <tr key={i}>
                            <th scope="row">{data.jobtitle}</th>
                            <td>{data.where}</td>
                            <td>{data.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <Row className="sec_sp">
                <Col lg="5">
                  <motion.h3 variants={fadeUp} className="color_sec py-4">Skills</motion.h3>
                </Col>
                <Col lg="7">
                  {skills.map((data, i) => (
                    <motion.div key={i} variants={fadeUp}>
                      <h3 className="progress-title">{data.name}</h3>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${data.value}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </Col>
              </Row>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Row className="sec_sp">
                <Col lang="5">
                  <motion.h3 variants={fadeUp} className="color_sec py-4">Services</motion.h3>
                </Col>
                <Col lg="7">
                  {services.map((data, i) => (
                    <motion.div variants={fadeUp} className="service_ py-4" key={i}>
                      <h5 className="service__title">{data.title}</h5>
                      <p className="service_desc">{data.description}</p>
                    </motion.div>
                  ))}
                </Col>
              </Row>
            </motion.div>

          </Container>
        </div>
      </div>
    </HelmetProvider>
  );
};

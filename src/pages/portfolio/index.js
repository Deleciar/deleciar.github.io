import React, { useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { dataportfolio, meta } from "../../content_option";

export const Portfolio = () => {
  const [selected, setSelected] = useState(null);

  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Portfolio | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Portfolio</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <div className="mb-5 po_items_ho">
          {dataportfolio.map((data, i) => (
            <div
              key={i}
              className="po_item"
              onClick={() => setSelected(data)}
            >
              <img src={data.img} alt={data.title} />
              <div className="content">
                <p>{data.description}</p>
                <span className="po_view_btn">View Details</span>
              </div>
            </div>
          ))}
        </div>

        <Modal
          show={!!selected}
          onHide={() => setSelected(null)}
          size="lg"
          centered
          className="po_modal"
        >
          {selected && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selected.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="po_modal_meta mb-3">
                  <span className="po_badge po_badge_employer">{selected.employer}</span>
                  <span className="po_badge po_badge_date">{selected.date}</span>
                  <span className="po_badge po_badge_cat">{selected.category}</span>
                </div>
                <p className="po_modal_details">{selected.details}</p>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn ac_btn"
                  onClick={() => setSelected(null)}
                >
                  Close
                  <div className="ring one"></div>
                  <div className="ring two"></div>
                  <div className="ring three"></div>
                </button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </HelmetProvider>
  );
};

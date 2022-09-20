import { Col, Row } from "react-bootstrap";
import PetCard from "./PetCard";
import React from "react";

export default function DisplayPets({ fetchedPets }) {
  return (
    <>
      <div className="d-flex w-100 p-0 m-0 justify-content-center d-flex">
        <Row
          xs={1}
          s={1}
          md={1}
          lg={2}
          xl={2}
          xxl={fetchedPets.length > 1 ? 3 : 1}
          className="g-4 gap-5 d-flex justify-content-center"
        >
          {fetchedPets &&
            fetchedPets.map((petObj) => {
              return (
                <Col key={petObj._id}>
                  {" "}
                  <PetCard petObj={petObj} key={petObj._id} />
                </Col>
              );
            })}
        </Row>
      </div>
    </>
  );
}

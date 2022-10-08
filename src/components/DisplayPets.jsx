import { Col, Row } from "react-bootstrap";
import PetCardSearch from "./PetCardSearch";
import React from "react";
import SpinnerComponent from "../components/SpinnerComponent";

export default function DisplayPets({ fetchedPets }) {
  if (typeof fetchedPets === "object" && fetchedPets.length === 0) return <SpinnerComponent />;
  else if (!fetchedPets) return <SpinnerComponent />;

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
          className="g-4 d-flex justify-content-center"
        >
          {fetchedPets &&
            fetchedPets.map((petObj) => {
              return (
                <Col key={petObj._id}>
                  {" "}
                  <PetCardSearch petObj={petObj} key={petObj._id} />
                </Col>
              );
            })}
        </Row>
      </div>
    </>
  );
}

import "../css/PetCard.css";
import { Button, Card } from "react-bootstrap";
import { capitelizeFirstLetter } from "../helpers/index.js";
import AppContext from "../contexts/AppContext";
import React, { useContext } from "react";
import StatusBadge from "./StatusBadge";
export default function PetCard({ petObj }) {
  const {
    _id,
    adoptionStatus,
    ageInMonths,
    animalType,
    bio,
    color,
    imageURL,
    name,
    rase,
  } = petObj;
  const { navigate, isLoading } = useContext(AppContext);

  function createPresentableBio(bioText) {
    return bioText.substr(0, 100) + "...";
  }

  async function navigateToPetPage(e) {
    try {
      navigate(`/pet/${_id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card
      className="d-flex overflow-hidden justify-content-between card"
      id="petCard"
      style={{ maxWidth: "400px" }}
    >
      <Card.Img
        // style={{ height: "90%", width: "50%",}}
        // variant="top"
        alt="pet"
        className="pet-img align-self-center"
        id="petIMG"
        onClick={navigateToPetPage}
        src={imageURL}
        style={{ height: "60%" }}
      />
      <Card.Body className="d-flex flex-column justify-content-start m-1 overflow-hidden">
        <Card.Title
          role="button"
          className="fw-bold"
          onClick={navigateToPetPage}
        >
          {name}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {ageInMonths} months old {rase} {animalType}
        </Card.Subtitle>
        <Card.Subtitle>
          {!isLoading && (
            <StatusBadge status={adoptionStatus}>
              {capitelizeFirstLetter(adoptionStatus)}
            </StatusBadge>
          )}
        </Card.Subtitle>
        <Card.Text></Card.Text>
        <Card.Text className="mt-0">Color: {color}</Card.Text>
        <Card.Text className="mt-0 card-bio">
          Biography: {createPresentableBio(bio)}
        </Card.Text>
      </Card.Body>
      <Button
        onClick={navigateToPetPage}
        className="my-2 w-50 align-self-center"
      >
        See More
      </Button>
    </Card>
  );
}

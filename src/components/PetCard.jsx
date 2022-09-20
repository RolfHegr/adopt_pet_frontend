import "../css/PetCard.css";
import { Button, Card, Badge } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import React, { useContext } from "react";

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

  async function goToPetPage(e) {
    try {
      navigate(`/pet/${_id}`);
    } catch (error) {
      console.error(error);
    }
  }

  function determineBadgeColor(adoptStatus) {
    if (adoptStatus === "available") return "success";
    if (adoptStatus === "fostered") return "warning";
    if (adoptStatus === "adopted") return "danger";
  }

  return (
    <Card
      className="m-1 p-1 px-2 d-flex overflow-hidden justify-content-between card"
      id="petCard"
      style={{ maxWidth: "400px" }}
    >
      <Card.Img
        className="m-1 pet-img align-self-center"
        // variant="top"
        alt="pet"
        id="petIMG"
        src={imageURL}
        onClick={goToPetPage}
        style={{ height: "60%" }}
      // style={{ height: "90%", width: "50%",}}
      />
      <Card.Body className="d-flex flex-column justify-content-start m-1 overflow-hidden">
        <Card.Title role="button" className="fw-bold" onClick={goToPetPage}>
          {name}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {ageInMonths} months old {rase} {animalType}
        </Card.Subtitle>
        <Card.Subtitle>
          {!isLoading && (
            <Badge bg={determineBadgeColor(adoptionStatus)}>
              {adoptionStatus}
            </Badge>
          )}
        </Card.Subtitle>
        <Card.Text></Card.Text>
        <Card.Text className="mt-0">color: {color}</Card.Text>
        <Card.Text className="mt-0 card-bio">
          Biography: {createPresentableBio(bio)}
        </Card.Text>
      </Card.Body>
      <Button onClick={goToPetPage} className="my-2 w-50 align-self-center">
        See More
      </Button>
    </Card>
  );
}

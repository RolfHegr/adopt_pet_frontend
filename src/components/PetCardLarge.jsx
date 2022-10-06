import React from "react";
import { Badge, Card, Container } from "react-bootstrap";

export default function PetCardLarge({ petObj }) {
  function determineBadgeColor(adoptStatus) {
    if (adoptStatus === "available") return "success";
    if (adoptStatus === "fostered") return "warning";
    if (adoptStatus === "adopted") return "danger";
  }

  return (
    <Container className="d-flex">
      <Container
        id={"c-petImg-PetPage"}
        className="d-flex flex-column align-items-center justify-content-start"
      >
        <Card.Img
          className="mt-2 pet-img px-4"
          variant="top"
          alt="pet"
          src={petObj.imageURL}
          id="petProfileImg"
          style={{ cursor: "default" }}
        />
        <Badge
          className="w-50 mt-1"
          bg={determineBadgeColor(petObj.adoptionStatus)}
        >
          {petObj.adoptionStatus}
        </Badge>
        <Card.Text className="m-3">Biography: {petObj.bio}</Card.Text>
      </Container>

      <Card.Body>
        <Card.Title>{petObj.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {petObj.ageInMonths} months old {petObj.rase}
        </Card.Subtitle>
        <Card.Text className="mt-0">
          <span> Animal Type:</span> {petObj.animalType}
        </Card.Text>
        <Card.Text className="mt-0">Breed: {petObj.breed}</Card.Text>

        <Card.Text className="mt-0">color: {petObj.color}</Card.Text>
        <Card.Text className="mt-0">
          Dietary Restrictions: {petObj.dietaryRestrictions}
        </Card.Text>

        <Card.Text className="mt-0">
          HypoAllergenic: {petObj.isHypoallergenic === true ? "Yes" : "No"}
        </Card.Text>
        <Card.Text className="mt-0">
          Weight: {petObj.weightInGrams / 1000} Kg
        </Card.Text>
        <Card.Text className="mt-0">Height: {petObj.heightInCm} Cm</Card.Text>
      </Card.Body>
    </Container>
  );
}

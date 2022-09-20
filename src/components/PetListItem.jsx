import "../css/AddPet.css";
import "../css/RemoveBootstrapDefault.css";
import { Badge, Button, Container, ListGroup } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import Image from "react-bootstrap/Image";
import React, { useContext } from "react";

export default function PetListItem({ petObj }) {
  const { navigate } = useContext(AppContext);

  const {
    _id,
    adoptedBy,
    adoptionStatus,
    breed,
    color,
    fosteredBy,
    heightInCm,
    imageURL,
    name,
    weightInGrams,
  } = petObj;

  function navigateToAddPet() {
    localStorage.setItem("mostRecentPetObj", JSON.stringify(petObj));
    navigate(`/addPet`);
  }

  function determineBadgeColor(adoptStatus) {
    if (adoptStatus === "available") return "success";
    if (adoptStatus === "fostered") return "warning";
    if (adoptStatus === "adopted") return "danger";
  }

  return (
    <Container className="" role="button">
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-center shadow-sm rounded pe-auto "
        id="petListElement"
        onClick={navigateToAddPet}
      >
        <Container className="ms-2 me-auto h-100">
          <Container className="d-flex justify-content-center">
            <Image
              style={{
                maxheight: "100px",
                maxWidth: "100px",
                objectFit: "cover",
              }}
              className="circle"
              src={imageURL}
              alt="Image of pet"
            ></Image>
          </Container>
        </Container>
        <Container className="ms-2 me-auto .min24">
          <Container className="fw-bold justify-content-center d-flex">Pet Name: </Container>
          <container className="fw-bold justify-content-center d-flex">{name} </container>
        </Container>
        <Container className="ms-2 me-auto .min16">
          <Container className=".min16 ms-2 me-auto fw-bold">Description</Container>
          <Container className="ms-2 me-auto">Color: {color} </Container>
          <Container className="ms-2 me-auto">Weight {weightInGrams} grams </Container>
          <Container className="ms-2 me-auto">Height {heightInCm} cm </Container>
        </Container>
        <Container className="ms-2 me-auto .min16">
          <Container className="ms-2 me-auto fw-bold">Breed </Container>
          <Container className="ms-2 me-auto">{breed} </Container>
        </Container>

        <Container className=".min16 ms-2 me-auto d-flex justify-content-center flex-column align-items-center flex-grow">
          <Container className="fw-bold d-flex justify-content-center">Pet Status:</Container>
          <h5>
            <Badge
              bg={determineBadgeColor(adoptionStatus)}
              className="mt-1"
              pill
            >
              {adoptedBy ? "Adopted" : ""}
              {fosteredBy ? "Fostered" : ""}

              {!fosteredBy && <> {!adoptedBy && "Available"}</>}
            </Badge>
          </h5>
        </Container>
        <Container className=".min16 me-auto d-flex flex-column justify-content-center align-items-center h-100">
          <Button className="mt-3">Edit pet</Button>
        </Container>
      </ListGroup.Item>
    </Container>
  );
}

import "../css/AddPet.css";
import { Badge, Button, Container, ListGroup } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import React, { useContext } from "react";

export default function UserListItem({ userObj }) {
  const {
    _id,
    adoptedPets,
    bio,
    email,
    firstName,
    fosteredPets,
    isAdmin,
    lastName,
    savedForLater,
    userName,
  } = userObj;

  const { navigate } = useContext(AppContext);

  function returnFirstSentence(longString) {
    const arrayOfSentences = longString.split(".");
    const firstSentence = arrayOfSentences[0] + ".";
    if (firstSentence.length > 40) {
      return "Explore user to read bio";
    }
    return firstSentence;
  }
  let badgeColor;
  isAdmin ? (badgeColor = "danger") : (badgeColor = "primary");

  function navigateToUserPage() {
    navigate(`/user/${_id}`);
  }

  return (
    <Container onClick={navigateToUserPage} className="" role="button">
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start shadow-sm rounded "
        id="userListElement"
      >
        <Container className="ms-2 me-auto min16">
          <Container className="fw-bold">User</Container>
          <Container className="">
            {firstName.toUpperCase()} {lastName.toUpperCase()}
          </Container>
          <Container>{userName}</Container>
        </Container>
        <Container className="ms-2 me-auto min16">
          <Container className="ms-2 me-auto fw-bold">EMAIL</Container>
          <Container className="ms-2 me-auto">{email}</Container>
          <Container className="ms-2 me-auto">text sldf sdfs </Container>
        </Container>
        <Container className="ms-2 me-auto min16 ">
          <Container className="ms-2 me-auto fw-bold">Bio </Container>
          <Container className="ms-2 me-auto ">
            {" "}
            {bio ? returnFirstSentence(bio) : "biography goes here"}{" "}
          </Container>
        </Container>

        <Container className="ms-2 me-auto min16">
          <Container className="ms-2 me-auto">Adopted: {adoptedPets.length}</Container>
          <Container className="ms-2 me-auto">Fostered {fosteredPets.length}</Container>
          <Container className="ms-2 me-auto">Saved: {savedForLater.length}</Container>
        </Container>

        <Container className=" min16ms-2 me-auto d-flex justify-content-center flex-column align-items-center flex-grow">
          <Container className="ms-2 me-auto fw-bold">User Status:</Container>
          <Container>
            <Badge bg={badgeColor} className="mt-1 w-100" pill>
              {isAdmin ? "ADMIN" : "USER"}
            </Badge>
          </Container>
        </Container>
        <Container className="min16 me-auto d-flex flex-column justify-content-center align-items-center h-100">
          <Button onClick={navigateToUserPage} className="mt-3">
            See More
          </Button>
        </Container>
      </ListGroup.Item>
    </Container>
  );
}

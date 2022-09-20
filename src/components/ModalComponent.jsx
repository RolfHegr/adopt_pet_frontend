import { Button, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import React from "react";

export default function ModalComponent({
  footer,
  header,
  modalContent,
  setShowPetModal,
  showPetModal,
}) {
  const navigate = useNavigate();
  const { imageURL, name, adoptionStatus, rase, ageInMonths, color, bio, _id } =
    modalContent;
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={showPetModal}
      onHide={() => setShowPetModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{header}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h1 className="mt-5 text-center">{name}</h1>
        <Card style={{ width: "40rem" }} className="m-2 d-flex flex-grow">
          <Card.Img
            className="mt-2 pet-img"
            variant="top"
            alt="pet"
            src={imageURL}
          />
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {ageInMonths} months old {rase}
            </Card.Subtitle>
            <Card.Text>Adoption Status: {adoptionStatus} </Card.Text>
            <Card.Text className="mt-0">color: {color}</Card.Text>
          </Card.Body>
          <Button onClick={() => navigate("/search-pets")} className="my-2">
            Back to pets
          </Button>
        </Card>
      </Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  );
}

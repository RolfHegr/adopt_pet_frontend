import "../css/PetCardSearch.css";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { Button, Container, Image } from "react-bootstrap";
import { capitalizeFirstLetter } from "../helpers/index.js";
import AppContext from "../contexts/AppContext";
import InfoBadge from "./InfoBadge";
import PetContext from "../contexts/PetContext";
import React, { useContext, useState } from "react";
import StatusBadge from "./StatusBadge";

export default function PetCard({ petObj }) {
  const {
    _id,
    adoptionStatus,
    ageInMonths,
    bio,
    color,
    imageURL,
    name,
    breed,
    weightInGrams,
  } = petObj;

  const { navigate, isLoading, setErrorMsg } = useContext(AppContext);
  const { savePetForLater, removeSavedPet } = useContext(PetContext);

  const [isPetSavedByUser, setIsPetSavedByUser] = useState(
    JSON.parse(localStorage.getItem("userObj"))?.savedForLater?.includes(_id)
  );

  function createPresentableBio(bioText) {
    return bioText.substr(0, 90) + "...";
  }

  async function navigateToPetPage(e) {
    try {
      navigate(`/pet/${_id}`);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSaveClickBtn() {
    if (isLoading) return;

    try {
      if (isPetSavedByUser) {
        setIsPetSavedByUser(false);
        await removeSavedPet(_id);
      } else {
        setIsPetSavedByUser(true);
        await savePetForLater(_id);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(e || e.message);
    }
  }

  return (
    <>
      <Container
        id="petCard"
        className="overflow-hidden d-flex bg-white flex-column border gap-4 p-0 box-shadow-tw br-1rem"
      >
        <div className="pos-relative">
          <Image
            alt="pet"
            className="pet-img align-self-center card-img br-1rem"
            onClick={navigateToPetPage}
            src={imageURL}
          />
          <Button onClick={handleSaveClickBtn} className="petCardSaveForLater">
            {isPetSavedByUser ? <BsHeartFill /> : <BsHeart />}
          </Button>
        </div>
        <div className="d-flex justify-content-center c-adopt-status">
          <StatusBadge status={adoptionStatus}>
            {capitalizeFirstLetter(adoptionStatus)}
          </StatusBadge>
        </div>

        <Container className="d-flex w-100 justify-content-between mt-1rem">
          <InfoBadge title="Age" value={ageInMonths} valueType={"Months"} />
          <InfoBadge title="Color" value={color} valueType={""} />
          <InfoBadge
            title="Name"
            value={capitalizeFirstLetter(name)}
            valueType={""}
          />
          <InfoBadge
            title="Weight"
            value={weightInGrams}
            valueType={"weight"}
          />
        </Container>

        <Container className="p-0 w-100">
          <div className="d-flex w-100 justify-content-between text fw-bold">
            <Container> {capitalizeFirstLetter(name)}</Container>
            <Container className="d-flex justify-content-end">
              {capitalizeFirstLetter(breed)}
            </Container>
          </div>
        </Container>

        <Container className="p-0 w-100">
          <Container className="fw-bold text">About</Container>
          <Container className="mb-1rem ">
            {createPresentableBio(capitalizeFirstLetter(bio))}
          </Container>
        </Container>

        <Button href={`/pet/${_id}`} className="my-2 w-50 align-self-center">
          See More
        </Button>
      </Container>
    </>
  );
}

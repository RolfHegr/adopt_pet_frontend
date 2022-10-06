import "../css/PetPage.css";
import { useNavigate } from "react-router";
import AppContext from "../contexts/AppContext";
import ArrowLeftSvg from "../resources/svg/ArrowLeftSvg";
import axios from "axios";
import HeartFilledSvg from "../resources/svg/HeartFilledSvg";
import HeartSvg from "../resources/svg/HeartSvg";
import PetCardLarge from "../components/PetCardLarge";
import PetContext from "../contexts/PetContext";
import React, { useContext, useEffect, useState } from "react";
import SpinnerComponent from "../components/SpinnerComponent.jsx";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Spinner,
} from "react-bootstrap";

export default function PetPage() {
  const [canBeAdopted, setCanBeAdopted] = useState(true);
  const [canPetBeReturnedByThisUser, setCanPetBeReturnedByThisUser] =
    useState(false);
  const [petCanBeFostered, setPetCanBeFostered] = useState(true);
  const [petCanBeSaved, setPetCanBeSaved] = useState(true);
  const [petObj, setPetObj] = useState(undefined);
  const navigate = useNavigate();

  const petIdURL = window.location.pathname;
  const petId = petIdURL.replace("/pet/", "");

  const {
    errorMsg,
    isLoading,
    setIsLoading,
    resultMessage,
    setErrorMsg,
    setLocalStorageWithUser,
    showSignupModal,
  } = useContext(AppContext);

  const {
    adoptPet,
    BASEURL_PETS,
    fosterPet,
    petsAdopted,
    petsFostered,
    removeSavedPet,
    returnPet,
    savePetForLater,
    setPetsAdopted,
    setPetsFostered,
  } = useContext(PetContext);

  const activeUser = JSON.parse(localStorage.getItem("userObj" || ""));
  const token = JSON.parse(localStorage.getItem("token" || ""));

  useEffect(() => {
    if (petObj) return;

    async function getAndSetPet() {
      const petData = await fetchIndividualPet(petId);
      setPetObj(petData);
    }

    getAndSetPet();
  }, []);

  async function fetchIndividualPet(idOfPet) {
    try {
      setIsLoading(true);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else if (!token && activeUser && activeUser.token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${activeUser.token}`;
      }

      const URL = `${BASEURL_PETS}/getPetById?id=${idOfPet}`;
      const res = await axios.get(URL);
      const { adoptedBy, fosteredBy, adoptionStatus } = res.data;

      if (activeUser) {
        const { _id } = activeUser;

        if (adoptedBy === _id || activeUser.adoptedPets.includes(petId)) {
          setCanPetBeReturnedByThisUser(true);
          setCanBeAdopted(false);
          setCanBeAdopted(false);
        }
        if (fosteredBy === _id || activeUser.fosteredPets.includes(petId)) {
          setCanPetBeReturnedByThisUser(true);
          setPetCanBeFostered(false);
          setCanBeAdopted(true);
        }
        if (activeUser.savedForLater.includes(petId)) {
          setPetCanBeSaved(false);
        }
        if (adoptionStatus === "adopted") {
          setPetCanBeFostered(false);
          setCanBeAdopted(false);
        }
        if (adoptionStatus === "fostered") {
          setPetCanBeFostered(false);
        }
      }

      setIsLoading(false);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function fosterThisPet() {
    try {
      setIsLoading(true);
      const resFostering = await fosterPet(petId);
      if (resFostering) {
        activeUser.fosteredPets.push(petId);
        setLocalStorageWithUser(activeUser);
      }
      await fetchIndividualPet(petId);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  async function adoptThisPet() {
    try {
      setIsLoading(true);
      let petHasBeenReturned = false;
      if (
        petObj.fosteredBy === activeUser._id ||
        activeUser.fosteredPets.includes(petId)
      ) {
        await returnBackPet();
        petHasBeenReturned = true;
      }
      if (!petHasBeenReturned && petObj.adoptionStatus === "fostered") {
        await returnBackPet();
      }

      await adoptPet(petId);
      await fetchIndividualPet(petId);
      setIsLoading(true);
      setCanPetBeReturnedByThisUser(true);
      setPetCanBeFostered(false);
      setCanBeAdopted(false);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  function updateFrontEndStorage(_id, fosteredPets, adoptedPets) {
    if (fosteredPets.includes(petId)) {
      const updatedFosteredPets = petsFostered.filter((id) => id !== petId);
      localStorage.setItem("petsFostered", JSON.stringify(updatedFosteredPets));
      setPetsFostered(updatedFosteredPets);

      const updatedFosteredIds = fosteredPets.filter((id) => id !== petId);
      activeUser.fosteredPets = updatedFosteredIds;
    } else {
      const updatedAdoptedPetArrOfObjects = petsAdopted.filter((id) => id !== petId);
      localStorage.setItem("petsAdopted", JSON.stringify(updatedAdoptedPetArrOfObjects));
      setPetsAdopted(updatedAdoptedPetArrOfObjects);

      const updatedAdoptedPetIdsArray = adoptedPets.filter((id) => id !== petId);
      activeUser.adoptedPets = updatedAdoptedPetIdsArray;
    }
  }

  async function returnBackPet() {
    try {
      const { adoptionStatus, _id } = petObj;

      const resReturn = await returnPet(petId, adoptionStatus);
      const resFetchPet = await fetchIndividualPet(petId);
      while (!resReturn || !resFetchPet) setIsLoading(true);

      const { fosteredPets, adoptedPets } = activeUser;
      updateFrontEndStorage(_id, fosteredPets, adoptedPets);
      setLocalStorageWithUser(activeUser);
      setCanBeAdopted(true);
      setPetCanBeFostered(true);
      setCanPetBeReturnedByThisUser(false);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  async function saveThisPet() {
    try {
      await savePetForLater(petId);
      await fetchIndividualPet(petId);
      setPetCanBeSaved(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  async function unSaveThisPet() {
    try {
      await removeSavedPet(petId);
      await fetchIndividualPet(petId);
      setPetCanBeSaved(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  function showResAndErrMsgs() {
    return (
      <>
        {resultMessage && (
          <Alert
            variant="success"
            className=" d-flex flex-column my-1"
            style={{
              height: "2rem",
              padding: "10px 10px 30px 10px",
            }}
          >
            <p className="m-0 text-center">{resultMessage}</p>
          </Alert>
        )}
        {errorMsg && (
          <Alert
            variant="danger"
            className=" d-flex flex-column text-align-center p-1  text-center"
          >
            <p className="m-0">{errorMsg}</p>
          </Alert>
        )}
      </>
    );
  }

  function saveUnSavePetBtn() {
    return (
      <>
        {petCanBeSaved && (
          <Button className="" onClick={saveThisPet}>
            <HeartSvg />
          </Button>
        )}
        {!petCanBeSaved && (
          <Button onClick={unSaveThisPet}>
            <HeartFilledSvg />
          </Button>
        )}
      </>
    );
  }

  function returnBtn() {
    return (
      <Button
        onClick={() => navigate("/search-pets")}
        className="my-2 text-white"
      >
        <ArrowLeftSvg />
      </Button>
    );
  }

  function fosterAndAdoptBtns() {
    return (
      <>
        {petCanBeFostered && (
          <Button
            className="w-25"
            disabled={!petCanBeFostered}
            onClick={fosterThisPet}
          >
            Foster
          </Button>
        )}
        {canBeAdopted && (
          <Button
            className="w-25"
            disabled={!canBeAdopted}
            onClick={adoptThisPet}
          >
            Adopt
          </Button>
        )}

        {canPetBeReturnedByThisUser && (
          <Button className="w-25" onClick={returnBackPet}>
            Return Pet
          </Button>
        )}
      </>
    );
  }

  if (!petObj) return <SpinnerComponent />;

  return (
    petObj && (
      <>
        <Container className="pt-5 max-height-100 ">
          <Container className="c-ProfilePage max-height-100 pt-5 d-flex flex-column align-items-center">
            <Card
              style={{ maxWidth: "70%", maxHeight: "85vh" }}
              className=" m-2 my-3 d-flex align-items-center justify-center pb-4"
            >
              <Container className="d-flex flex-row justify-content-between gap-4 align-items-center">
                {returnBtn()}

                {!isLoading && showResAndErrMsgs()}
                {activeUser && saveUnSavePetBtn()}
              </Container>

              <PetCardLarge petObj={petObj} />

              <div className="w-100 d-flex justify-content-center"></div>
              <Container className="d-flex flex-row align-items-center gap-4 justify-content-center">
                {activeUser && !isLoading && fosterAndAdoptBtns()}
                {!activeUser && !isLoading && (
                  <Button onClick={showSignupModal}>
                    Sign up to Adopt or Foster
                  </Button>
                )}

                {isLoading && (
                  <Button>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </Button>
                )}
              </Container>
            </Card>
          </Container>
        </Container>
      </>
    )
  );
}

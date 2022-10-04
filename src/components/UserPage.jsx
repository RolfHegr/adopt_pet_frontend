import "../css/AddPet.css";
import { useNavigate } from "react-router";
import AppContext from "../contexts/AppContext";
import axios from "axios";
import PetCard from "./PetCard";
import PetContext from "../contexts/PetContext";
import React, { useContext, useEffect, useState } from "react";
import SpinnerComponent from "./SpinnerComponent";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";

export default function PetPage({}) {
  const [badgeColor, setBadgeColor] = useState("primary");
  const petIdURL = window.location.pathname;
  const userId = petIdURL.replace("/user/", "");
  const [userObj, setUserObj] = useState({
    __v: 0,
    _id: "",
    adoptedPets: [],
    email: "",
    firstName: "",
    fosteredPets: [],
    isAdmin: false,
    lastName: "",
    phoneNum: "",
    savedForLater: [],
    userName: "",
  });
  const navigate = useNavigate();

  const {
    activeUser,
    BASEURL_USERS,
    errorMsg,
    isLoading,
    resultMessage,
    setErrorMsg,
    setIsLoading,
    token,
  } = useContext(AppContext);

  const {
    fetchPetObjectsFromSavedAdoptedAndFostered,
    petsAdopted,
    petsFostered,
    savedPets,
  } = useContext(PetContext);

  async function fetchIndividualUser() {
    try {
      setIsLoading(true);
      // const correctUser = allUsers.filter((user) => user._id === userId);
      if (!token && localStorage.getItem("token")) axios.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(localStorage.getItem("token"))}`;
      else axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const URL = `${BASEURL_USERS}/user/${userId}`;
      const res = await axios.get(URL);
      const user = res.data;

      await fetchPetObjectsFromSavedAdoptedAndFostered(user);
      setUserObj(user);

      user.isAdmin ? setBadgeColor("danger") : setBadgeColor("primary");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  }

  useEffect(() => {
    fetchIndividualUser();
  }, []);

  return (
    <>
      <SpinnerComponent />

      {!isLoading && (
        <>
          <Container className="pt-5 ">
            <Container className="c-ProfilePage pt-5 d-flex flex-column align-items-center justify-content-start gap-5">
              {!isLoading && (
                <>
                  {" "}
                  {resultMessage && (
                    <Alert
                      variant="success"
                      className="m-3 mb-0 mx-5 d-flex flex-column"
                    >
                      <span className="m-0 text-center">{resultMessage}</span>
                    </Alert>
                  )}
                  {errorMsg && (
                    <Alert
                      variant="danger"
                      className="m-3 mx-5 d-flex flex-column text-center"
                    >
                      <span className="m-0">{errorMsg}</span>
                    </Alert>
                  )}
                </>
              )}
              <Card
                style={{ width: "40rem" }}
                className=" m-2 d-flex flex-grow align-items-center justify-center pb-4 mt-5 shadow-sm rounded"
              >
                <Container className="d-flex flex-row justify-content-center gap-4 align-items-center">
                  <Button
                    onClick={() => navigate("/getUsers")}
                    className="my-2 w-25"
                  >
                    Return to users
                  </Button>
                </Container>

                <div
                  id={"c-petImg-PetPage"}
                  className="d-flex flex-column"
                ></div>

                <Card.Body className="w-50">
                  <Card.Title>
                    {userObj.firstName} {userObj.lastName}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {userObj.userName}
                  </Card.Subtitle>
                  <Card.Text className="mt-0">Email: {userObj.email}</Card.Text>
                  <Card.Text className="mt-0">
                    Phone Number: {userObj.phoneNum}
                  </Card.Text>
                  <div>
                    <div>
                      User Status:
                      {userObj.isAdmin && (
                        <Badge bg={badgeColor} className="mt-1" pill>
                          {userObj.isAdmin ? "ADMIN" : ""}
                        </Badge>
                      )}
                      {!userObj.isAdmin && (
                        <Badge bg={badgeColor} className="mt-1" pill>
                          {userObj.isAdmin ? "ADMIN" : "USER"}
                        </Badge>
                      )}
                    </div>
                    <Card.Text className="d-flex flex-colum gap-4 mt-3">
                      <span>Adopted: {userObj.adoptedPets.length} </span>
                      <span>Fostered {userObj.fosteredPets.length}</span>
                      <span>Saved: {userObj.savedForLater.length}</span>
                    </Card.Text>
                  </div>
                </Card.Body>
                <div className="w-100 d-flex justify-content-center"></div>
                <Container className="d-flex flex-column align-items-center gap-5 mt-4 justify-content-center"></Container>
              </Card>
              <Container className="my-4 d-flex flex-row justify-content-center">
                <Container className="d-flex flex-column">
                  <h1 className="headline">Adopted Pets:</h1>
                  <Row
                    xs={1}
                    s={1}
                    md={1}
                    lg={1}
                    xl={1}
                    xxl={1}
                    className="g-5 d-flex justify-content-center mt-2"
                  >
                    {petsAdopted &&
                      petsAdopted.map((petObj) => {
                        const uniqueKey = `${petObj._id}789`;
                        return (
                          <Col key={petObj._id}>
                            <PetCard petObj={petObj} key={uniqueKey} />
                          </Col>
                        );
                      })}
                  </Row>
                </Container>

                <Container className="d-flex flex-column">
                  <h1 className="headline">Fostered Pets:</h1>
                  <Row
                    xs={1}
                    s={1}
                    md={1}
                    lg={1}
                    xl={1}
                    xxl={1}
                    className="g-5 d-flex justify-content-center mt-2"
                  >
                    {petsFostered &&
                      petsFostered.map((petObj) => {
                        const uniqueKey = `${petObj._id}456`;
                        return (
                          <Col key={petObj._id}>
                            <PetCard petObj={petObj} key={uniqueKey} />
                          </Col>
                        );
                      })}
                  </Row>
                </Container>

                <Container className="d-flex flex-column">
                  <h1 className="headline">Saved Pets:</h1>
                  <Row
                    xs={1}
                    s={1}
                    md={1}
                    lg={1}
                    xl={1}
                    xxl={1}
                    className="g-5 d-flex justify-content-center mt-2"
                  >
                    {savedPets &&
                      savedPets.map((petObj) => {
                        const uniqueKey = `${petObj._id}123`;
                        return (
                          <Col key={petObj._id}>
                            <PetCard petObj={petObj} key={uniqueKey} />
                          </Col>
                        );
                      })}
                  </Row>
                </Container>
              </Container>
            </Container>
          </Container>
        </>
      )}
    </>
  );
}

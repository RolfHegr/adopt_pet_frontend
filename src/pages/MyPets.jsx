import { Button, Container, Row, Spinner, ToggleButton } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import PetCard from "../components/PetCard";
import PetContext from "../contexts/PetContext";
import React, { useContext, useEffect, useState } from "react";

export default function MyPets() {
  const { activeUser, isLoading } = useContext(AppContext);

  const {
    fetchPetObjectsFromSavedAdoptedAndFostered,
    petsAdopted,
    petsFostered,
    savedPets,
  } = useContext(PetContext);

  const [haveAdopted, setHaveAdopted] = useState(false);
  const [haveFostered, setHaveFostered] = useState(false);
  const [haveSavedPets, setHaveSavedPets] = useState(false);
  const [checked, setChecked] = useState(false);

  function doesUserOwnOrSavePets() {
    if (activeUser.adoptedPets.length > 0) setHaveAdopted(true);
    if (activeUser.fosteredPets.length > 0) setHaveFostered(true);
    if (activeUser.savedForLater.length > 0) setHaveSavedPets(true);
  }

  useEffect(() => {
    if (activeUser) {
      doesUserOwnOrSavePets();
      fetchPetObjectsFromSavedAdoptedAndFostered();
    }

    return () => {
      doesUserOwnOrSavePets();
      fetchPetObjectsFromSavedAdoptedAndFostered();
    };
  }, []);

  return (
    <Container className="c-ProfilePage pt-3 d-flex flex-column align-items-center my-5">
      {!isLoading && (
        <>
          <Container className="d-flex flex-column my-5">
            <ToggleButton
              className="mb-2 w-25 align-self-center btn-primary text-white"
              id="toggle-check"
              type="checkbox"
              variant="outline-primary"
              checked={checked}
              value="1"
              style={{ minWidth: "9rem" }}
              onChange={(e) => setChecked(e.currentTarget.checked)}
            >
              {checked ? "See Pets" : "See Saved Pets"}
            </ToggleButton>
            {!checked && (
              <>
                {" "}
                {!haveAdopted && !haveFostered && (
                  <h1 className="headline">
                    You don"t foster nor own any pets
                  </h1>
                )}
              </>
            )}
            {!checked && (
              <>
                <Container className=" gap-2 m-0 ">
                  <>
                    {(haveAdopted || haveFostered) && (
                      <>
                        <h1 className="headline text center mt-3">
                          Owned Pets
                        </h1>
                        <Container className="gap-5 d-flex flex-row">
                          <Row
                            xs={1}
                            s={1}
                            md={1}
                            lg={2}
                            xl={2}
                            className="g-5 d-flex flex-row justify-content-start mt-2"
                          >
                            {petsAdopted &&
                              petsAdopted.map((petObj) => {
                                const uniqueKey = `${petObj._id}789`;
                                return (
                                  <PetCard
                                    styles={{ height: "25rem" }}
                                    petObj={petObj}
                                    key={uniqueKey}
                                  />
                                );
                              })}
                          </Row>
                          <Row
                            xs={1}
                            s={1}
                            md={1}
                            lg={2}
                            xl={2}
                            className="g-5 d-flex flex-row justify-content-start mt-2"
                          >
                            {petsFostered &&
                              petsFostered.map((petObj) => {
                                const uniqueKey = `${petObj._id}456`;
                                return (
                                  <PetCard
                                    styles={{ height: "25rem" }}
                                    petObj={petObj}
                                    key={uniqueKey}
                                  />
                                );
                              })}
                          </Row>
                        </Container>
                      </>
                    )}{" "}
                  </>
                </Container>
              </>
            )}

            {checked && (
              <>
                {!haveSavedPets && (
                  <h1 className="headline text center mt-3">
                    You have not saved any pets..
                  </h1>
                )}
                {haveSavedPets && (
                  <>
                    <h1 className="headline mt-3">Saved Pets:</h1>
                    <Container className="d-flex flex-column ">
                      <Row
                        xs={1}
                        s={1}
                        md={1}
                        lg={1}
                        xl={1}
                        className="g-5 d-flex mt-2"
                      >
                        {savedPets &&
                          savedPets.map((petObj) => {
                            const uniqueKey = `${petObj._id}123`;
                            return <PetCard petObj={petObj} key={uniqueKey} />;
                          })}
                      </Row>
                    </Container>
                  </>
                )}
              </>
            )}
          </Container>
        </>
      )}
      {isLoading && (
        <Container className="c-ProfilePage pt-3 d-flex flex-column align-items-center my-5">
          <Button className="btn-lg">
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
          </Button>
        </Container>
      )}
    </Container>
  );
}

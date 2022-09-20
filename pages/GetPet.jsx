import "../css/AddPet.css";
import { Container } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import PetContext from "../contexts/PetContext";
import PetListItem from "../components/PetListItem"
import React, { useContext, useEffect, useState } from "react";
import SpinnerComponent from "../components/SpinnerComponent";

export default function GetPet() {
  const [arrayOfAllPets, setArrayOfAllPets] = useState(null);
  const { getAllPets } = useContext(PetContext);
  const { setIsLoading } = useContext(AppContext);

  useEffect(() => {
    generatePetList();
  }, []);

  async function generatePetList() {
    setIsLoading(true);
    const arrOfPets = await getAllPets();
    setArrayOfAllPets(arrOfPets);
    setIsLoading(false);
  }
  return (
    <>
      <SpinnerComponent />
      <Container className="c-ProfilePage pt-5 pb-5 mt-3 d-flex gap-3 flex-column headline">
        <h1 className="mt-5 text-center">Get Pet</h1>
        {arrayOfAllPets &&
          arrayOfAllPets.map((petObj) => {
            return <PetListItem petObj={petObj} key={petObj._id} />;
          })}
      </Container>
    </>
  );
}

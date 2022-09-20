import "../css/SearchPets.css";
import AppContext from "../contexts/AppContext";
import DisplayPets from "../components/DisplayPets";
import PetContext from "../contexts/PetContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import SpinnerComponent from "../components/SpinnerComponent";
import {
  Button,
  Container,
  FormControl,
  InputGroup,
  Collapse,
  Form,
} from "react-bootstrap";

export default function SearchPets() {
  const [fetchedPets, setFetchPets] = useState([]);
  const [open, setOpen] = useState(false);
  const { getAllPets } = useContext(PetContext);
  const { isLoading } = useContext(AppContext);

  const adoptionStatusRef = useRef();
  const heightRef = useRef();
  const nameRef = useRef();
  const searchRef = useRef();
  const typeRef = useRef();
  const weightRef = useRef();

  useEffect(() => {
    fetchAllPets();
  }, []);

  async function fetchAllPets(e) {
    const arrayOfPets = await getAllPets();
    setFetchPets(arrayOfPets);
  }

  async function fetchPets(e) {
    e.preventDefault();
    let queryParams = `http://localhost:8000/api/v1/pets/getPets`;

    //only available if advanced search is not toggled
    if (!open) {
      if (searchRef.current.value) {
        queryParams += `?animalType=${searchRef.current.value}`;
        const res = await getAllPets(queryParams);
        setFetchPets(res);
        return;
      }
      if (searchRef.current.value === null || !searchRef.current.value) {
        const res = await getAllPets();
        setFetchPets(res.data);
      }
    }

    let alreadyInputs = false;

    if (open) {
      if (nameRef.current.value !== "") {
        if (alreadyInputs) queryParams += `&name=${nameRef.current.value}`
        if (!alreadyInputs) {
          queryParams += `?name=${nameRef.current.value}`;
          alreadyInputs = true;
        }
      }

      if (weightRef.current.value !== "") {
        if (alreadyInputs) queryParams += `&weightInGrams=${weightRef.current.value}`;
        if (!alreadyInputs) {
          queryParams += `?weightInGrams=${weightRef.current.value}`;
          alreadyInputs = true;
        }
      }

      if (heightRef.current.value !== "") {
        if (alreadyInputs) queryParams += `&heightInCm=${heightRef.current.value}`;
        if (!alreadyInputs) {
          queryParams += `?heightInCm=${heightRef.current.value}`;
          alreadyInputs = true;
        }
      }
      if (typeRef.current.value !== "All types") {
        if (alreadyInputs) queryParams += `&animalType=${typeRef.current.value}`;
        if (!alreadyInputs) {
          queryParams += `?animalType=${typeRef.current.value}`;
          alreadyInputs = true;
        }
      }
      if (adoptionStatusRef.current.value !== "All") {
        if (alreadyInputs) queryParams += `&adoptionStatus=${adoptionStatusRef.current.value}`;
        if (!alreadyInputs) {
          queryParams += `?adoptionStatus=${adoptionStatusRef.current.value}`;
          alreadyInputs = true;
        }
      }
    }

    const res = await getAllPets(queryParams);
    setFetchPets(res);
  }

  return (
    <div className="c-search-pets w-100 m-auto mt-5">
      <Container className="mb-0 mt-5 p-0">
        <Form id="advanced-search-form" className="mb-0 px-3">
          <InputGroup className="my-3">
            <FormControl
              size="lg"
              placeholder="Search pet by type"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              ref={searchRef}
              disabled={open}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  fetchPets(e);
                }
              }}
            />
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              ↓
            </Button>

            <Button onClick={fetchPets} variant="primary" id="button-addon2">
              Search Pets
            </Button>
          </InputGroup>
        </Form>
      </Container>
      <Collapse in={open}>
        <Container>
          <Form>
            <InputGroup className="d-flex gap-3 align-items-center justify-content-between p-2 mb-3 mt-0">
              <Form.Group>
                <Form.Label>Pet Name</Form.Label>
                <Form.Control
                  ref={nameRef}
                  type="text"
                  placeholder="Pet Name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Group>
                  <Form.Label>Weight (grams)</Form.Label>
                  <Form.Control
                    // ref={weightInGramsRef}
                    type="number"
                    placeholder="1242"
                    ref={weightRef}
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group>
                <Form.Label>Height (cm)</Form.Label>
                <Form.Control type="number" placeholder="35" ref={heightRef} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Type:</Form.Label>
                <Form.Select
                  // ref={animalTypeRef}
                  aria-label="Default select example"
                  ref={typeRef}
                >
                  <option value={null}>All types</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="snake">Snake</option>
                  <option value="peacock">Peacock</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Adoption Status:</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  ref={adoptionStatusRef}
                >
                  <option value={null}>All</option>
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                  <option value="fostered">Fostered</option>
                </Form.Select>
              </Form.Group>
            </InputGroup>
          </Form>
        </Container>
      </Collapse>
      <Container className="p-0">
        <SpinnerComponent />
        {!isLoading && (
          <>
            {fetchedPets.length === 0 && (
              <h1 className="headline">No pets found</h1>
            )}
          </>
        )}
        {!isLoading && <DisplayPets fetchedPets={fetchedPets} />}
      </Container>
    </div>
  );
}

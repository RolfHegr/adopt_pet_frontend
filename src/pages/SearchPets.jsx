import "../css/SearchPets.css";
import { BsSearch } from "react-icons/bs";
import { GreetingHeader } from "../components/GreetingHeader.jsx";
import AppContext from "../contexts/AppContext";
import DisplayPets from "../components/DisplayPets";
import PetContext from "../contexts/PetContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Collapse,
  Container,
  Form,
  FormControl,
  InputGroup,
  Spinner,
} from "react-bootstrap";

export default function SearchPets() {
  const [fetchedPets, setFetchPets] = useState([]);
  const [advSearchOpen, setAdvSearchOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { getAllPets, BASEURL_PETS } = useContext(PetContext);
  const { isLoading, setIsLoading, activeUser } = useContext(AppContext);

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
    setIsFetching(false);
  }

  async function fetchPets(e) {
    // TODO rewrite this func
    e.preventDefault();
    let queryParams = `${BASEURL_PETS}/getPets`;

    if (!advSearchOpen) {
      if (searchRef.current.value) {
        queryParams += `?animalType=${searchRef.current.value.toLowerCase()}`;
        const res = await getAllPets(queryParams);
        setFetchPets(res);
        return;
      }
      if (!searchRef.current.value) {
        const res = await getAllPets();
        setFetchPets(res.data);
      }
    }

    let alreadyInputs = false;

    if (advSearchOpen) {
      if (nameRef.current.value !== "") {
        if (alreadyInputs) queryParams += `&name=${nameRef.current.value}`;
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

  function displaySpinner() {
    if (activeUser) return;

    return (
      <Container className="pt-5 mt-4 ">
        <Container className="c-ProfilePage pt-5 d-flex flex-column align-items-center justify-content-start gap-5">
          <Button>
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
          </Button>
        </Container>
      </Container>
    );
  }

  return (
    <Container className="c-search-pets w-100 m-auto mt-5">
      <Container className="mb-0 mt-5 p-0">
        <GreetingHeader />
        <Form id="advanced-search-form" className="mb-0 d-flex justify-content-center align-items-center">
          <InputGroup className="my-3" id="input-group">
            <FormControl
              aria-describedby="basic-addon2"
              aria-label="Recipient's username"
              disabled={advSearchOpen}
              placeholder="Search pet by type"
              ref={searchRef}
              size="lg"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  fetchPets(e);
                }
              }}
            />
            <Button
              aria-controls="example-collapse-text"
              aria-expanded={advSearchOpen}
              onClick={() => setAdvSearchOpen(!advSearchOpen)}
              style={{ border: "none", boxShadow: "none" }}
            >
              ↓
            </Button>

            <Button
              id="button-addon2"
              onClick={fetchPets}
              style={{ border: "none", boxShadow: "none" }}
              variant="primary"
            >
              <BsSearch />
            </Button>
          </InputGroup>
        </Form>
      </Container>
      <Collapse in={advSearchOpen}>
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
        {isFetching && !isLoading && displaySpinner()}
        {!isLoading && !isFetching && (
          <>
            {fetchedPets.length === 0 && (
              <h1 className="headline">No pets found</h1>
            )}
          </>
        )}
        <DisplayPets fetchedPets={fetchedPets} />
      </Container>
    </Container>
  );
}

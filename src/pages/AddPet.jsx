import "../css/AddPet.css";
import AppContext from "../contexts/AppContext";
import PetContext from "../contexts/PetContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

export default function AddPet() {
  const { activeUser, resultMessage, isLoading, errorMsg, setErrorMsg } =
    useContext(AppContext);

  const { addPetToDB } = useContext(PetContext);

  // eslint-disable-next-line no-unused-vars
  const [buttonText, setButtonText] = useState("Add Pet");
  const [disableForm, setDisableForm] = useState(false);
  const [image, setImage] = useState(null);
  const [inputPetObj, setInputPetObj] = useState(JSON.parse(localStorage.getItem("mostRecentPetObj")));

  //REFs for input field
  const adoptionStatusRef = useRef();
  const ageInMonthsRef = useRef();
  const animalTypeRef = useRef();
  const breedRef = useRef();
  const colorRef = useRef();
  const dietaryRestrictionsRef = useRef();
  const heightInCmRef = useRef();
  const imageURLRef = useRef();
  const isHypoallergenicRef = useRef();
  const petBioRef = useRef();
  const petNameRef = useRef();
  const updatePetRef = useRef();
  const uploadedImgRef = useRef();
  const weightInGramsRef = useRef();

  useEffect(() => {
    if (inputPetObj) {
      fillFormWithExistingPet();
      setButtonText("Update Pet");
    }
    return () => {
      // Removes after 5sek in case accidentally clicked off the site
      setTimeout(() => {
        removePetFromLs();
      }, 5000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removePetFromLs() {
    localStorage.removeItem("mostRecentPetObj");
  }

  function handleChange(event) {
    setDisableForm(false);
    setErrorMsg("");
    event.preventDefault();

    if (ageInMonthsRef.current.value.length > 2) {
      setErrorMsg("age in months can't be more than two characters");
      setDisableForm(true);
    }
  }

  function fillFormWithExistingPet() {
    adoptionStatusRef.current.value = inputPetObj.adoptionStatus;
    ageInMonthsRef.current.value = inputPetObj.ageInMonths;
    animalTypeRef.current.value = inputPetObj.animalType;
    breedRef.current.value = inputPetObj.breed;
    colorRef.current.value = inputPetObj.color;
    dietaryRestrictionsRef.current.value = inputPetObj.dietaryRestrictions;
    heightInCmRef.current.value = inputPetObj.heightInCm;
    imageURLRef.current.value = inputPetObj.imageURL;
    isHypoallergenicRef.current.value = inputPetObj.isHypoallergenic;
    petBioRef.current.value = inputPetObj.bio;
    petNameRef.current.value = inputPetObj.name;
    updatePetRef.current.checked = true;
    weightInGramsRef.current.value = inputPetObj.weightInGrams;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const isFormValidated = formValidation();
    if (!isFormValidated) return;

    const petObj = {
      name: petNameRef.current.value,
      imageURL: imageURLRef.current.value,
      ageInMonths: ageInMonthsRef.current.value,
      heightInCm: heightInCmRef.current.value,
      breed: breedRef.current.value,
      animalType: animalTypeRef.current.value,
      weightInGrams: weightInGramsRef.current.value,
      color: colorRef.current.value,
      dietaryRestrictions: dietaryRestrictionsRef.current.value,
      isHypoallergenic: isHypoallergenicRef.current.value,
      adoptionStatus: adoptionStatusRef.current.value.toLowerCase(),
      bio: petBioRef.current.value,
      createdBy: activeUser._id,
      _id: activeUser._id,
    };

    let updateOrCreateNew;
    
    if (updatePetRef.current.checked) {
      updateOrCreateNew = "update";
      petObj.petId = inputPetObj._id;
    } else updateOrCreateNew = "create";

    if (image) {
      //Creating Form Data if admin is uploading IMG
      const formData = new FormData();
      formData.append("image", image);
      petObj.imageURL = undefined;
      for (let key in petObj) {
        formData.append(key, petObj[key]);
      }
      await addPetToDB(formData, updateOrCreateNew);
    } else {
      petObj.image = null;
      await addPetToDB(petObj, updateOrCreateNew);
    }
  }

  function handleImageUpload(event) {
    setImage(event.target.files[0]);
  }

  function formValidation() {
    if (!activeUser.isAdmin) {
      setErrorMsg("Only Admins can add pets");
      return false;
    }
    if (!petNameRef.current.value) {
      setErrorMsg("Add Pet Name");
      return false;
    }
    if (!colorRef.current.value) {
      setErrorMsg("Add Pet Color");
      return false;
    }

    if (!petBioRef.current.value) {
      setErrorMsg("Please add a biography");
      return false;
    }
    if (!imageURLRef.current.value) {
      if (!image) {
        setErrorMsg("Add a photo of pet - either URL or upload one.");
        return false;
      }
    }
    if (!ageInMonthsRef.current.value) {
      setErrorMsg("Please add age");
      return false;
    }
    return true;
  }

  return (
    <Container className="c-AddPet pt-5">
      <Container>
        {!isLoading && (
          <>
            {" "}
            {resultMessage && (
              <Alert variant="success" className="my-5 d-flex flex-column">
                <p className="m-0 text-center">{resultMessage}</p>
              </Alert>
            )}
            {errorMsg && (
              <Alert
                variant="danger"
                className="my-5 d-flex flex-column text-center"
              >
                <p className="m-0">{errorMsg}</p>
              </Alert>
            )}
          </>
        )}

        <Form
          disabled={disableForm}
          className="shadow-lg p-4 mt-2 pt-3 rounded"
        >
          <h1 className=" text-center headline my-3">Add Pet</h1>
          <Row className="mb-3 pb-2">
            <Form.Group as={Col}>
              <Form.Label>Pet Name</Form.Label>
              <Form.Control
                ref={petNameRef}
                type="text"
                placeholder="Pet Name"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Pet Age Months</Form.Label>
              <Form.Control
                onChange={handleChange}
                type="number"
                ref={ageInMonthsRef}
                placeholder="56"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                ref={heightInCmRef}
                placeholder="35"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Breed</Form.Label>
              <Form.Control type="text" placeholder="Terrier" ref={breedRef} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Type of Animal</Form.Label>
              <Form.Select
                ref={animalTypeRef}
                aria-label="Default select example"
              >
                <option value="all">Choose...</option>
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="other">Other</option>
                <option value="peacock">Peacock</option>
                <option value="snake">Snake</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Weight (grams)</Form.Label>
              <Form.Control
                ref={weightInGramsRef}
                type="number"
                placeholder=""
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Color</Form.Label>
              <Form.Control type="text" ref={colorRef} placeholder="Gray" />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Dietary Restrictions</Form.Label>
              <Form.Control
                type="text"
                ref={dietaryRestrictionsRef}
                placeholder="Allergic to milk"
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Adoption Status</Form.Label>
              <Form.Select
                aria-label="Default select example"
                ref={adoptionStatusRef}
              >
                <option value="available">Available</option>
                <option value="adopted">Adopted</option>
                <option value="fostered">Fostered</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Allergy Friendly</Form.Label>
              <Form.Select defaultValue="Choose..." ref={isHypoallergenicRef}>
                <option>Choose...</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex justify-content-center">
                Pet Biography
              </Form.Label>
              <textarea
                ref={petBioRef}
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="4"
                maxLength={500}
                style={{ maxHeight: "150px", minHeight: "70px" }}
                onChange={handleChange}
              ></textarea>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Image of Pet</Form.Label>
              <Form.Control
                type="file"
                ref={uploadedImgRef}
                onChange={handleImageUpload}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Or provide link to Image</Form.Label>
              <Form.Control
                ref={imageURLRef}
                type="url"
                placeholder="https://....."
              />
            </Form.Group>
          </Row>
          <Container className="d-flex flex-column justify-content-center p-0">
            <Container className="p-0 d-flex flex-column gap-2">
              <Form.Check
                className="my-1"
                ref={updatePetRef}
                onChange={handleChange}
                label="Double Click to update Existing Pet?"
                aria-label="option 1"
              />
            </Container>
            {!isLoading && (
              <Button
                onClick={handleSubmit}
                variant="primary"
                className="btn-lg"
                type="submit"
                disabled={disableForm}
              >
                {buttonText}
              </Button>
            )}
            {isLoading && (
              <Button className="btn-lg">
                <Spinner
                  as="span"
                  animation="border"
                  size="lg"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            )}
          </Container>
        </Form>
      </Container>
      <Container></Container>
    </Container>
  );
}

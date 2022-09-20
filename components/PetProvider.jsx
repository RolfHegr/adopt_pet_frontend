import AppContext from "../contexts/AppContext";
import axios from "axios";
import PetContext from "../contexts/PetContext";
import React, { useContext, useState } from "react";

export default function PetProvider({ children }) {
  const {
    activeUser,
    arrayOfPetObjects,
    setActiveUser,
    setArrayOfPetObjects,
    setErrorMsg,
    setIsLoading,
    setLocalStorageWithUser,
    setResultMessage,
    token,
  } = useContext(AppContext);

  const [petsAdopted, setPetsAdopted] = useState(JSON.parse(localStorage.getItem("petsAdopted")));
  const [petsFostered, setPetsFostered] = useState(JSON.parse(localStorage.getItem("petsFostered")));
  const [savedPets, setSavedPets] = useState(JSON.parse(localStorage.getItem("savedPets")));

  const BASEURL_PETS = "http://localhost:8000/api/v1/pets";

  //PETS
  async function fetchPetObjectsFromSavedAdoptedAndFostered(userObject) {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setResultMessage("");

      let adoptedPetIds = activeUser.adoptedPets;
      let fosteredPetIds = activeUser.fosteredPets;
      let savedPetIds = activeUser.savedForLater;

      //if func is passed userObject, then fetch that users fostered,adopted and saved pets.
      if (userObject) {
        adoptedPetIds = userObject.adoptedPets;
        fosteredPetIds = userObject.fosteredPets;
        savedPetIds = userObject.savedForLater;
      }

      if (!token) {
        if (activeUser.token) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${activeUser.token}`;
        } else {
          const lsToken = localStorage.getItem("token");
          if (lsToken) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${JSON.parse(lsToken)}`;
          }
        }
      }

      const URL = `${BASEURL_PETS}/getCollectionOfPets`;

      const responseAdopted = await axios.post(URL, adoptedPetIds);
      const responseFostered = await axios.post(URL, fosteredPetIds);
      const responseSaved = await axios.post(URL, savedPetIds);

      setPetsAdopted(responseAdopted.data);
      setPetsFostered(responseFostered.data);
      setSavedPets(responseSaved.data);

      localStorage.setItem("petsAdopted", JSON.stringify(responseAdopted.data));
      localStorage.setItem("petsFostered", JSON.stringify(responseFostered.data));
      localStorage.setItem("savedPets", JSON.stringify(responseSaved.data));

      setIsLoading(false);

      return [responseFostered.data, responseSaved.data, responseAdopted.data];
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function getAllPets(queryParams) {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setResultMessage("");
      let fetchURL = `${BASEURL_PETS}/getPets`;
      if (queryParams) {
        fetchURL = queryParams;
      }
      const res = await axios.get(fetchURL);

      if (res) {
        const arrayOfPets = res.data;
        setIsLoading(false);
        return arrayOfPets;
      }
    } catch (error) {
      console.error("error response", error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function getPetsByUser(userId) {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASEURL_PETS}/getCollectionOfPets/?id=${userId}`);
      setResultMessage("users pets fetched");
      setIsLoading(false);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function updateExistingPet(petObj) {
    try {
      setErrorMsg("");
      setResultMessage("");
      setIsLoading(true);

      let URL;
      if (petObj.image !== null) URL = `${BASEURL_PETS}/updatePetWithImage`;
      else URL = `${BASEURL_PETS}/updatePet`;

      petObj["_id"] = activeUser["_id"]; //attatching the userId to verify ADMIN in BE
      const res = await axios.patch(URL, petObj);

      if (res) {
        setResultMessage("Pet was successfully Updated");
        setIsLoading(false);
        return res.data;
      }
    } catch (error) {
      console.error("error response", error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function addPetToDB(petObj, updateOrCreateNew) {
    setErrorMsg("");
    setResultMessage("");
    if (updateOrCreateNew === "update") {
      try {
        petObj._id = activeUser._id;
        const res = await updateExistingPet(petObj);
        if (res) {
          setResultMessage("pet successfully added to the db");
        }
      } catch (error) {
        setErrorMsg(error.message);
        throw error;
      }
    }
    if (updateOrCreateNew === "create") {
      try {
        setIsLoading(true);

        let URL;
        if (petObj.image !== null) URL = `${BASEURL_PETS}/addPetAndUploadImage`;
        else URL = `${BASEURL_PETS}/addPet`;

        const res = await axios.post(URL, petObj);

        if (res) {
          setResultMessage("Pet was successfully Created");
          setIsLoading(false);
          return res.data;
        }
      } catch (error) {
        console.error("error response", error);
        setErrorMsg(error.message);
        setIsLoading(false);
      }
    }
  }

  async function fosterPet(petId) {
    try {
      setErrorMsg("");
      setResultMessage("");
      const URL = `${BASEURL_PETS}/fosterPet?id=${petId}`;
      const res = await axios.post(URL, activeUser);

      if (res) {
        const { pet } = res.data;
        if (!activeUser.fosteredPets.includes(pet._id)) {
          let updatedPetsArray = [];

          if (petsFostered !== null) {
            updatedPetsArray = [...petsFostered];
          }
          updatedPetsArray.push(pet);
          localStorage.setItem("petsFostered", JSON.stringify(updatedPetsArray));
          setPetsFostered(updatedPetsArray);
          activeUser.fosteredPets.push(pet._id);
          setLocalStorageWithUser(activeUser);
          setResultMessage("Pet was successfully fostered");
          setIsLoading(false);
          return pet;
        }
      }
    } catch (error) {
      console.error("error response", error);
      setErrorMsg(error.message);
    }
  }

  function adoptPetFrontEnd(pet, petId) {
    let updatedPetsAdopted = [];
    if (petsAdopted !== null) updatedPetsAdopted = [...petsAdopted, pet];
    else updatedPetsAdopted.push(pet)

    localStorage.setItem("petsAdopted", JSON.stringify(updatedPetsAdopted));
    setPetsAdopted(updatedPetsAdopted);
    activeUser.adoptedPets.push(pet._id);

    if (activeUser.fosteredPets.includes(petId)) {
      activeUser.fosteredPets = activeUser.fosteredPets.filter((id) => id !== petId);
    }
  }

  async function adoptPet(petId) {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setResultMessage("");
      const URL = `${BASEURL_PETS}/adoptPet?id=${petId}`;
      const res = await axios.post(URL, activeUser);

      if (res) {
        const { pet } = res.data;

        adoptPetFrontEnd(pet, petId)

        setLocalStorageWithUser(activeUser);
        setResultMessage("Pet was successfully adopted");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("error response", error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function fetchPetById(petId) {
    try {
      setErrorMsg("");
      setResultMessage("");
      setIsLoading(true);
      const URL = `${BASEURL_PETS}/getPetById?id=${petId}`;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get(URL);
      const { data } = res;
      if (data) {
        setArrayOfPetObjects([...arrayOfPetObjects, data]);
        setIsLoading(false);
        return data;
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function returnPet(petId, petStatus) {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setResultMessage("");

      let URL = "";
      if (petStatus === "fostered") URL = `${BASEURL_PETS}/unFosterPet?id=${petId}`;
      if (petStatus === "adopted") URL = `${BASEURL_PETS}/unAdoptPet?id=${petId}`;

      // TODO remove from ls

      const res = await axios.post(URL, activeUser);

      if (res) {
        console.log(res.data)
        setResultMessage("Pet was successfully returned");
        setIsLoading(false);
        return res;
      }
    } catch (error) {
      console.error("error response", error);
      if (error.message) setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  function savePetFrontEnd(pet) {
    let updatedSavedPets = [];
    if (savedPets) updatedSavedPets = [...savedPets, pet];
    else updatedSavedPets.push(pet);

    localStorage.setItem("savedPets", JSON.stringify(updatedSavedPets));
    setSavedPets(updatedSavedPets);
    activeUser.savedForLater.push(pet._id);
  }

  async function savePetForLater(petId) {
    try {
      setErrorMsg("");
      setResultMessage("");
      setIsLoading(true);

      const URL = `${BASEURL_PETS}/savePetForLater?id=${petId}`;
      const res = await axios.post(URL, activeUser);
      if (res) {
        const { pet } = res.data;
        savePetFrontEnd(pet);

        setLocalStorageWithUser(activeUser);
        setResultMessage("Pet was successfully saved");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("error response", error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function removeSavedPet(petId, petStatus) {
    try {
      setErrorMsg("");
      setResultMessage("");
      setIsLoading(true);
      const URL = `${BASEURL_PETS}/unSavePet?id=${petId}`;

      const res = await axios.post(URL, activeUser);
      if (res) {
        //Setting new active user
        const newActiveUser = res.data;
        setLocalStorageWithUser(newActiveUser);
        setActiveUser(newActiveUser);

        const updatedSavedPets = savedPets.filter((petObj) => petObj._id !== petId);
        localStorage.setItem("savedPets", JSON.stringify(updatedSavedPets));
        setSavedPets(updatedSavedPets);
        const updatedSavedPetsArr = activeUser.savedForLater.filter((id) => id !== petId);
        activeUser.savePetForLater = updatedSavedPetsArr;

        setResultMessage("Pet was successfully removed from saved pets");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("error response", error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  return (
    <PetContext.Provider
      value={{
        addPetToDB,
        adoptPet,
        BASEURL_PETS,
        fetchPetById,
        fetchPetObjectsFromSavedAdoptedAndFostered,
        fetchPetObjectsFromSavedAdoptedAndFostered,
        fosterPet,
        getAllPets,
        getPetsByUser,
        petsAdopted,
        petsFostered,
        removeSavedPet,
        returnPet,
        savedPets,
        savePetForLater,
        setPetsAdopted,
        setPetsFostered,
        setSavedPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

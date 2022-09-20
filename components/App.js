import "../css/App.css";
import "../css/RemoveBootstrapDefault.css";
import "../css/ResponsiveDesign.css";
import "../css/TextStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router";
import { useContext } from "react";
import AddPet from "../pages/AddPet"
import AppContext from "../contexts/AppContext";
import GetPet from "../pages/GetPet";
import GetUsers from "../pages/GetUsers";
import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage";
import LoginModal from "./LoginModal";
import MyPets from "../pages/MyPets";
import NavigationBar from "./NavigationBar";
import PetPage from "../pages/PetPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPets from "../pages/SearchPets";
import SignupModal from "./SignupModal";
import UserPage from "./UserPage";

function App() {
  const { activeUser, isAdmin, allUsers } = useContext(AppContext);

  return (
    <>
      {!activeUser && (
        <>
          <LandingPage />
          <LoginModal />
          <SignupModal />
          <Routes>
            <Route path="/search-pets" element={<SearchPets />}></Route>
            <Route path="/pet/:id" element={<PetPage />}></Route>
          </Routes>
        </>
      )}
      {activeUser && (
        <>
          <NavigationBar />
          <LoginModal />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search-pets" element={<SearchPets />}></Route>
            <Route path="/pet/:id" element={<PetPage />}></Route>
            <Route
              path="/user/:id"
              element={<UserPage allUsers={allUsers} />}
            ></Route>
            <Route path="/my-pets" element={<MyPets />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            {isAdmin && <Route path="/addPet" element={<AddPet />}></Route>}
            {isAdmin && <Route path="/getPet" element={<GetPet />}></Route>}
            {isAdmin && <Route path="/getUsers" element={<GetUsers />}></Route>}
          </Routes>
        </>
      )}
    </>
  );
}

export default App;

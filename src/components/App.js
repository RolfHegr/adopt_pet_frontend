import "../css/App.css";
import "../css/RemoveBootstrapDefault.css";
import "../css/ResponsiveDesign.css";
import "../css/TextStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router";
import { useContext } from "react";
import AddPet from "../pages/AddPet";
import AppContext from "../contexts/AppContext";
import GetPet from "../pages/GetPet";
import GetUsers from "../pages/GetUsers";
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

  if (!activeUser) {
    return (
      <>
        <NavigationBar />
        <LoginModal />
        <SignupModal />
        <Routes>
          <Route path="/" element={<SearchPets />} />
          <Route path="/search-pets" element={<SearchPets />}></Route>
          <Route path="/pet/:id" element={<PetPage />}></Route>
        </Routes>
      </>
    );
  }

  if (activeUser) {
    return (
      <>
        <NavigationBar />
        <LoginModal />

        <Routes>
          <Route path="/" element={<SearchPets />} />
          <Route path="/search-pets" element={<SearchPets />} />
          <Route path="/pet/:id" element={<PetPage />} />
          <Route path="/user/:id" element={<UserPage allUsers={allUsers} />} />
          <Route path="/my-pets" element={<MyPets />} />
          <Route path="/profile" element={<ProfilePage />} />

          {isAdmin && <Route path="/addPet" element={<AddPet />} />}
          {isAdmin && <Route path="/getPet" element={<GetPet />} />}
          {isAdmin && <Route path="/getUsers" element={<GetUsers />} />}
        </Routes>
      </>
    );
  }
}

export default App;

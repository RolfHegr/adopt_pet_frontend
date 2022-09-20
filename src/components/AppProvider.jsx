/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router";
import AppContext from "../contexts/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function AppProvider({ children }) {
  const [activeUser, setActiveUser] = useState(JSON.parse(localStorage.getItem("userObj")));
  const [allUsers, setAllUsers] = useState(null);
  const [arrayOfAllUsers, setArrOfAllUsers] = useState(null);
  const [arrayOfPetObjects, setArrayOfPetObjects] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem("isAdmin")));
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupModalShow, setSignupModalShow] = useState(false);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const navigate = useNavigate();

  function setLocalStorageWithUser(user) {
    try {
      const userStringified = JSON.stringify(user);
      localStorage.setItem("userObj", userStringified);
    } catch (error) {
      console.error(error);
    }
  }
  function setTokenToLocalStorage(tok) {
    try {
      const tokenStringified = JSON.stringify(tok);
      localStorage.setItem("token", tokenStringified);
    } catch (error) {
      console.error(error);
    }
  }

  const BASEURL_USERS = "http://localhost:8000/api/v1/auth";

  useEffect(() => {
    async function fetchUsersFromDb() {
      setIsLoading(true);
      await getAllUsers();
      setIsLoading(false);
      if (activeUser) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }
    fetchUsersFromDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createNewUser(newUser) {
    setErrorMsg(null);
    setSignupError(null);
    try {
      setIsLoading(true);
      const res = await axios.post(`${BASEURL_USERS}/register`, newUser);
      setSignupError("Success, signing you up..");
      const { user, token } = res.data;
      setTokenToLocalStorage(token);

      const userAndToken = user;
      userAndToken.token = token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setActiveUser(userAndToken);
      setLocalStorageWithUser(user);
      setIsLoading(false);
      setSignupModalShow(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      setSignupError(error.message || error);
      console.error("error response", error.response.data.msg);
      setErrorMsg(error.response.data.msg || error);
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setIsLoading(true);
      localStorage.clear();
      setErrorMsg("");
      setActiveUser(null);
      navigate("/");
      setResultMessage("")
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  }

  async function userLogin(userObj) {
    try {
      setLoginError(null);
      setErrorMsg(null);
      setIsLoading(true);
      setResultMessage("");
      const res = await axios.post(`${BASEURL_USERS}/login`, userObj);

      if (res) {
        setResultMessage("Success! Logging in..");
        const { user, token } = res.data;
        setTokenToLocalStorage(token);
        const userAndToken = user;
        userAndToken.token = token;
        if (user.isAdmin) localStorage.setItem("isAdmin", JSON.stringify(true));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setLocalStorageWithUser(user);
        setActiveUser(userAndToken);
        navigate("/");
        window.location.reload();

        setIsLoading(false);
        setLoginModal(false);
      }
    } catch (error) {
      setLoginError(error.message || error);
      console.error("error response", error);
      setIsLoading(false);
    }
  }

  async function updateUser(userObj) {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setResultMessage("");
      userObj["_id"] = activeUser["_id"];
      const res = await axios.patch(`${BASEURL_USERS}/updateUser`, userObj);

      if (res) {
        const { user, token } = res.data;
        const userAndToken = user;
        userAndToken.token = token;
        setLocalStorageWithUser(user);
        setActiveUser(userAndToken);
        setResultMessage("Update Successful");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMsg(error.response.data.msg || error.message);
      console.error("error response", error);
      setIsLoading(false);
    }
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  async function getAllUsers() {
    try {
      if (activeUser && !activeUser.isAdmin) return;
      if (activeUser) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setIsLoading(true);
      setErrorMsg(null);
      setResultMessage("");


      const URL = `${BASEURL_USERS}/getUsers`;
      const res = await axios.post(URL, activeUser);
      return res.data;
    } catch (error) {
      setErrorMsg(error.message);
      console.error(error);
      setIsLoading(false);
    }
  }

  async function deleteUserAccount() {
    try {
      setIsLoading(true);
      const { fosteredPets, adoptedPets } = activeUser;

      if (fosteredPets.length > 0 || adoptedPets.length > 0) {
        return setErrorMsg("Please return pets before deleting your account");
      }

      const URL = `${BASEURL_USERS}/deleteAccount`;
      const res = await axios.delete(URL, { data: { activeUser } });
    
      if (res) {
        setTimeout(() => {
          handleLogout();
        }, 5000);
        setResultMessage("Account successfully deleted. You will be logged out shortly.");
        setIsLoading(false);
      }
    } catch (error) { }
  }

  //Login && Signup Modal
  function showSignupModal() {
    setSignupModalShow(true);
  }

  function showLoginModal() {
    setLoginModal(true);
  }

  function onHideLogin() {
    setLoginModal(false);
  }
  function onHideSignup() {
    setSignupModalShow(false);
  }

  return (
    <AppContext.Provider
      value={{
        activeUser,
        allUsers,
        arrayOfAllUsers,
        arrayOfPetObjects,
        createNewUser,
        deleteUserAccount,
        errorMsg,
        getAllUsers,
        handleLogout,
        isAdmin,
        isLoading,
        loginError,
        loginModal,
        navigate,
        onHideLogin,
        onHideSignup,
        resultMessage,
        setActiveUser,
        setArrOfAllUsers,
        setErrorMsg,
        setIsLoading,
        setLocalStorageWithUser,
        setLoginError,
        setLoginModal,
        setResultMessage,
        setSignupError,
        setSignupModalShow,
        showLoginModal,
        showSignupModal,
        signupError,
        signupModalShow,
        updateUser,
        userLogin,
        validateEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

import { Container } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import React, { useContext, useEffect, useState } from "react";
import SpinnerComponent from "../components/SpinnerComponent";
import UserListItem from "../components/UserListItem";

export default function GetUsers() {
  const [arrayOfAllUsers, setArrayOfAllUsers] = useState(null);
  const { activeUser, getAllUsers, setIsLoading } = useContext(AppContext);

  useEffect(() => {
    if (activeUser) generateUserList();
  }, []);

  async function generateUserList() {
    setIsLoading(true);
    const arrayOfUsers = await getAllUsers();
    setArrayOfAllUsers(arrayOfUsers);
    setIsLoading(false);
  }

  return (
    <>
      <SpinnerComponent />
      <Container className="c-ProfilePage pt-5 pb-5 mt-3 d-flex gap-3 flex-column headline">
        <h1 className="mt-5 text-center">Get Users</h1>
        {arrayOfAllUsers &&
          arrayOfAllUsers.map((userObj) => {
            return <UserListItem userObj={userObj} key={userObj._id} />;
          })}
      </Container>
    </>
  );
}

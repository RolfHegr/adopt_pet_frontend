import { useContext } from "react";
import { Container } from "react-bootstrap";
import AppContext from "../contexts/AppContext";

export const GreetingHeader = () => {
  const { activeUser } = useContext(AppContext);

  const getFullName = () => {
    return `, ${activeUser.firstName} ${activeUser.lastName}.`;
  };

  return (
    <>
      <Container className="p-0 text-center">
        <h1 className="headline font-weight-bold mt-4"> 
          Welcome to Adoptify{activeUser ? getFullName() : ""}
        </h1>
        <h5 className="text">
          View pets or create a user to unlock all features.
        </h5>

      </Container>
    </>
  );
};

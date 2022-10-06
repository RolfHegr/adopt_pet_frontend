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
        <h2 className="headline mt-4">
          Welcome to Adoptify{activeUser ? getFullName() : "."}
        </h2>

      </Container>
    </>
  );
};

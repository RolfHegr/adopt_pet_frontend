import { useContext } from "react";
import { Container } from "react-bootstrap";
import AppContext from "../contexts/AppContext";

export const GreetingHeader = () => {
  const { activeUser } = useContext(AppContext);

  return (
    <>
      <Container>
        <h2 className='headline mt-4'>
          Welcome to Adoptify, {activeUser.firstName} {activeUser.lastName}.
        </h2>

        <p className='my-2 lh-base fw-light '>
          Make a difference by virtually adopting and fostering pets. <br></br>
          <span className='d-inline-block'>
            {" "}
            Don't want to commit? Save pets for later!
          </span>
        </p>
      </Container>
    </>
  );
};

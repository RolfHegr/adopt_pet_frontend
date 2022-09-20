import { Button, Container, Spinner } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import React, { useContext } from "react";

export default function SpinnerComponent() {
  const { isLoading } = useContext(AppContext);
  return (
    <>
      {isLoading && (
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
      )}
    </>
  );
}

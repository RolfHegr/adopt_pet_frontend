import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useRef } from "react";
import AppContext from "../contexts/AppContext";
import React, { useContext, useEffect, useState } from "react";

export default function LoginModal(props) {
  const {
    isLoading,
    loginError,
    loginModal,
    onHideLogin,
    resultMessage,
    setIsLoading,
    setLoginError,
    userLogin,
  } = useContext(AppContext);

  const [disableBtn, setDisableBtn] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const emailRef = useRef();
  const pwdRef = useRef();

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  }, []);

  function handleChange(e) {
    e.preventDefault();
    const emailInput = emailRef.current.value;
    const pwdInput = pwdRef.current.value;
    if (emailInput && pwdInput) {
      setDisableBtn(false);
    }
    if (!emailInput || !pwdInput) {
      setDisableBtn(true);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!emailRef.current.value || !pwdRef.current.value) {
      setLoginError("Fill out all required fields...");
      setShowAlert(true);
      return;
    }

    const userObj = {
      email: emailRef.current.value,
      password: pwdRef.current.value,
      userName: emailRef.current.value,
    };

    const res = await userLogin(userObj);
    if (res) onHideLogin();
    //Navigate to homepage - logged in
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={loginModal}
      onHide={onHideLogin}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="font-weight-bold">Email address</Form.Label>
            <Form.Control
              ref={emailRef}
              type="email"
              placeholder="Enter email"
              onChange={handleChange}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Form.Group className="mb-1" controlId="formBasicPassword">
            <Form.Label className="font-weight-bold">Password</Form.Label>
            <Form.Control
              onChange={handleChange}
              ref={pwdRef}
              type="password"
              placeholder="Password"
            />
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}
          <Button
            className="mb-3 w-100"
            id="loginBtn"
            variant="primary"
            type="submit"
            onClick={handleLogin}
            disabled={isLoading}
          >
            Log in
          </Button>
          {loginError && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              <Alert.Heading>Oops! Error</Alert.Heading>
              <p>{loginError}</p>
            </Alert>
          )}
          {!isLoading && (
            <>
              {" "}
              {resultMessage && (
                <Alert variant="success" className="my-5 d-flex flex-column">
                  <p className="m-0 text-center">{resultMessage}</p>
                </Alert>
              )}
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
      {isLoading && (
        <div className="w-100 text-center">
          <Spinner animation="border" role="status" variant="secondary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Modal>
  );
}

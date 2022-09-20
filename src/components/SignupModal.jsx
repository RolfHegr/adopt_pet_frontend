import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useRef } from "react";
import AppContext from "../contexts/AppContext";
import React, { useContext, useEffect, useState } from "react";

export default function SignupModal() {
  const {
    createNewUser,
    isLoading,
    onHideSignup,
    setIsLoading,
    setSignupError,
    signupError,
    signupModalShow,
  } = useContext(AppContext);
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneNumRef = useRef();
  const pwdRef = useRef();
  const repeatpwdRef = useRef();
  const userNameRef = useRef();

  const [disableBtn, setDisableBtn] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  //input values

  useEffect(() => {
    function killIsLoadingErr() {
      if (isLoading) {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
    killIsLoadingErr();

    return () => {
      killIsLoadingErr();
    };
  }, []);

  function handleChange(e) {
    setSignupError(null);
    const emailValue = emailRef.current.value;
    const fName = firstNameRef.current.value;
    const lName = lastNameRef.current.value;
    const phoneNum = phoneNumRef.current.value;
    const pwd = pwdRef.current.value;
    const repeatPwd = repeatpwdRef.current.value;

    e.preventDefault();
    if (!fName || !lName || !emailValue || !phoneNum || !pwd || !repeatPwd) {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  }

  async function handleSignup(e) {
    const emailValue = emailRef.current.value;
    const fName = firstNameRef.current.value;
    const lName = lastNameRef.current.value;
    const phoneNum = phoneNumRef.current.value;
    const pwd = pwdRef.current.value;
    const userNameValue = userNameRef.current.value;
    e.preventDefault();

    if (!fName || !lName || !emailValue || !phoneNum || !pwd) {
      setErrorMsg("Fill out all required fields...");
      setShowAlert(true);
      return;
    }

    if (pwdRef.current.value !== repeatpwdRef.current.value) {
      setSignupError("passwords must match");
      return;
    }

    const newUser = {
      email: emailValue,
      firstName: firstNameRef.current.value,
      lastName: lName,
      password: pwd,
      phoneNum: phoneNum,
      repeatPassword: repeatpwdRef.current.value,
      userName: userNameValue,
    };

    const res = await createNewUser(newUser);
    if (res) onHideSignup();
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={signupModalShow}
      onHide={onHideSignup}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Sign up to Adopt a pet
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Floating className="mb-3">
            <Form.Control
              ref={firstNameRef}
              required
              type="text"
              placeholder="First name"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputCustom">First Name</label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              ref={lastNameRef}
              required
              type="text"
              placeholder="Last name"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputCustom">Last Name</label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              ref={emailRef}
              type="email"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputCustom">Email address</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              ref={userNameRef}
              type="email"
              placeholder="name@example.com"
              onChange={handleChange}
            />
            <label htmlFor="floatingInputCustom">Username</label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              ref={phoneNumRef}
              onChange={handleChange}
              type="number"
              placeholder="050 555 5555"
            />
            <label htmlFor="floatingInputCustom">Phone Number</label>
          </Form.Floating>

          <Form.Floating>
            <Form.Control
              ref={pwdRef}
              id="floatingPasswordCustom"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <label htmlFor="floatingPasswordCustom">Password</label>
          </Form.Floating>

          <Form.Floating className="my-2">
            <Form.Control
              ref={repeatpwdRef}
              id="floatingPasswordRepeat"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <label htmlFor="floatingPasswordCustom">Verify Password</label>
          </Form.Floating>

          <Button
            className="mb-3 w-100"
            id="loginBtn"
            variant="primary"
            type="submit"
            onClick={handleSignup}
            disabled={isLoading}
          >
            Sign Up
          </Button>
          {signupError && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              <Alert.Heading>Oops! Error</Alert.Heading>
              <p>{signupError}</p>
            </Alert>
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

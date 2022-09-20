import "../css/ProfilePage.css";
import AppContext from "../contexts/AppContext";
import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Spinner,
  Table,
} from "react-bootstrap";

export default function ProfilePage() {
  const [userObj, setUserObj] = useState(null);

  const {
    activeUser,
    deleteUserAccount,
    errorMsg,
    isLoading,
    resultMessage,
    setErrorMsg,
    setResultMessage,
    updateUser,
    validateEmail,
  } = useContext(AppContext);

  const [disableTextArea, setDisableTextArea] = useState(false);

  const bioRef = useRef();
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const phoneNumRef = useRef();
  const pwdRef = useRef();
  const repeatpwdRef = useRef();
  const userNameRef = useRef();

  function handleTextChange(e) {
    e.preventDefault();
    const bio = bioRef.current.value;
    const emailValue = emailRef.current.value;
    const fName = firstNameRef.current.value;
    const lName = lastNameRef.current.value;
    const phoneNum = phoneNumRef.current.value;
    const pwd = pwdRef.current.value;
    const repeatpwd = repeatpwdRef.current.value;
    const userNameValue = userNameRef.current.value;

    //Disabling btn if no input
    if (!bio &&
      !emailValue &&
      !fName &&
      !lName &&
      !phoneNum &&
      !pwd &&
      !repeatpwd &&
      !userNameValue) {
      return setUserObj(false);
    }

    setDisableTextArea(false);
    setErrorMsg("");
    //creating userObj
    setUserObj({ ...userObj, [e.target.id]: e.target.value });
  }

  async function handleUpdateUser(e) {
    e.preventDefault();
    setErrorMsg("");
    setResultMessage("");
    const bio = bioRef.current.value;
    const email = emailRef.current.value;
    const pwd = pwdRef.current.value;
    const repeatpwd = repeatpwdRef.current.value;

    if (pwd && !repeatpwd) return setErrorMsg("Please repeat the password");
    if (pwd !== repeatpwd) return setErrorMsg("Passwords must match");
    if (email && validateEmail(email)) return setErrorMsg("Please provide valid email");

    if (bio.length > 200) {
      setErrorMsg("Bio must be shorter than 200 characters");
      setDisableTextArea(true);
      setTimeout(() => {
        setDisableTextArea(false);
      }, 2500);
      return;
    }

    await updateUser(userObj);
  }

  async function handleDelete(e) {
    e.preventDefault();
    await deleteUserAccount();
  }

  return (
    <>
      <Container className="c-ProfilePage pt-5">
        <h1 className="my-5 text-center">Update Profile</h1>
        <Container className="d-flex flex-column p-0">
          <h4>Current Profile</h4>
          {!isLoading && (
            <>
              {resultMessage && (
                <Alert variant="success" className="my-4 d-flex flex-column">
                  <p className="m-0 text-center">{resultMessage}</p>
                </Alert>
              )}
              {errorMsg && (
                <Alert
                  variant="danger"
                  className="my-4 d-flex flex-column text-center"
                >
                  <p className="m-0">{errorMsg}</p>
                </Alert>
              )}
            </>
          )}

          <Container className="w-100 d-flex justify-content-center">
            <Card className="w-50 ">
              <Card.Header>
                <h2>
                  {activeUser.firstName} {activeUser.lastName}
                </h2>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover size="lg">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone Num</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{activeUser.firstName}</td>
                      <td>{activeUser.lastName}</td>
                      <td>{activeUser.userName}</td>
                      <td>{activeUser.email}</td>
                      <td>{activeUser.phoneNum}</td>
                    </tr>
                  </tbody>
                </Table>
                <Card.Body>
                  <h5>About:</h5>
                  {activeUser.bio}
                </Card.Body>
              </Card.Body>
            </Card>
          </Container>
        </Container>
        <Form className="d-flex justify-content-center align-items-center flex-column">
          <Form.Floating className="mb-3 w-100">
            <Form.Control
              ref={firstNameRef}
              required
              type="text"
              placeholder="First name"
              onChange={handleTextChange}
              id="firstName"
            />
            <label htmlFor="floatingInputCustom">First Name</label>
          </Form.Floating>

          <Form.Floating className="mb-3 w-100">
            <Form.Control
              ref={lastNameRef}
              id="lastName"
              required
              type="text"
              placeholder="Last name"
              onChange={handleTextChange}
            />
            <label htmlFor="floatingInputCustom">Last Name</label>
          </Form.Floating>

          <Form.Floating className="mb-3 w-100">
            <Form.Control
              ref={emailRef}
              id="email"
              type="email"
              placeholder="name@example.com"
              onChange={handleTextChange}
            />
            <label htmlFor="floatingInputCustom">Email address</label>
          </Form.Floating>
          <Form.Floating className="mb-3 w-100">
            <Form.Control
              ref={userNameRef}
              id="userName"
              type="email"
              placeholder="name@example.com"
              onChange={handleTextChange}
            />
            <label htmlFor="floatingInputCustom">Username</label>
          </Form.Floating>

          <Form.Floating className="mb-3 w-100">
            <Form.Control
              ref={phoneNumRef}
              id="phoneNum"
              onChange={handleTextChange}
              type="number"
              placeholder="050 555 5555"
            />
            <label htmlFor="floatingInputCustom">Phone Number</label>
          </Form.Floating>

          <Form.Floating className="w-100 mb-3">
            <Form.Control
              ref={pwdRef}
              type="password"
              placeholder="Password"
              onChange={handleTextChange}
              id="password"
            />
            <label htmlFor="floatingPasswordCustom">Password</label>
          </Form.Floating>

          <Form.Floating className="my-2 w-100">
            <Form.Control
              ref={repeatpwdRef}
              id="repeatPassword"
              type="password"
              placeholder="Password"
              onChange={handleTextChange}
            />
            <label htmlFor="floatingPasswordCustom">Verify Password</label>
          </Form.Floating>

          <Form.Group className="mb-3 w-100">
            <Form.Label className="d-flex justify-content-center">
              User Biography
            </Form.Label>
            <textarea
              className="form-control textarea"
              id="bio"
              ref={bioRef}
              rows="3"
              onChange={handleTextChange}
              disabled={disableTextArea}
            ></textarea>
          </Form.Group>
          {!errorMsg && (
            <>
              {" "}
              {!isLoading && (
                <Button
                  className="mb-3 w-100"
                  id="updateUser"
                  variant="primary"
                  type="submit"
                  onClick={handleUpdateUser}
                  disabled={!userObj}
                >
                  Update User Profile
                </Button>
              )}
            </>
          )}
          {isLoading && (
            <Button>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            </Button>
          )}
        </Form>
        {!isLoading && (
          <Button
            className="mb-3 w-100"
            id="deleteAccountBtn"
            variant="danger"
            type="submit"
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        )}
      </Container>
    </>
  );
}

import "../css/NavigationBar.css";
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router";
import AppContext from "../contexts/AppContext";
import petLogo from "../resources/logo.gif";
import React, { useContext } from "react";

export default function NavigationBar() {
  const { setSignupModalShow, showLoginModal, handleLogout, activeUser, isAdmin } =
    useContext(AppContext);
  const navigate = useNavigate();

  function createGreeting(user) {
    let greeting = "";
    const date = new Date();
    const hours = date.getHours();

    if (hours < 12) return (greeting = `Good Morning ${activeUser.firstName} `);
    if (hours < 18) return greeting = `Good afternoon ${activeUser.firstName} `;
    else return `Good Evening ${activeUser.firstName} `;
  }

  return (
    <Navbar collapseOnSelect fixed="top" expand="sm" bg="light" variant="light">
      <Container>
        <Navbar.Brand className="px-4" href="/">
          <Image
            height={30}
            width={30}
            src={petLogo}
            alt="pet logo"
            className="mx-1"
          />
          Adoptify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="w-100 px-2">
            <Nav.Link href="/">Home</Nav.Link>
            {activeUser && <Nav.Link href="/search-pets">Search</Nav.Link>}
            {activeUser && <Nav.Link href="/my-pets">My Pets</Nav.Link>}
            {isAdmin && (
              <NavDropdown title={"Admin"} id="nav-dropdown">
                <NavDropdown.Item
                  onClick={() => navigate("/addPet")}
                  eventKey="4.1"
                >
                  Add Pet
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey="4.2"
                  onClick={() => navigate("/getPet")}
                >
                  Get pet
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey="4.3"
                  onClick={() => navigate("/getUsers")}
                >
                  Get users
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <div className="d-flex flex-direction-row justify-content-end w-100 justify-flex-end mx-4">
              {!activeUser && (
                <Nav.Link onClick={showLoginModal}>Login</Nav.Link>
              )}
              {!activeUser && (
                <Nav.Link onClick={() => setSignupModalShow(true)}>Sign-up</Nav.Link>
              )}{" "}
              {/* {activeUser && (
                <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
              )} */}
              {activeUser && (
                <NavDropdown
                  title={createGreeting(activeUser)}
                  id="nav-dropdown"
                >
                  <NavDropdown.Item
                    onClick={() => navigate("/profile")}
                    eventKey="4.1"
                  >
                    Profile Settings
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item eventKey="4.2">Action</NavDropdown.Item> */}
                  {/* <NavDropdown.Item eventKey="4.3">
                    Something else here
                  </NavDropdown.Item> */}
                  <NavDropdown.Divider />
                  <NavDropdown.Item eventKey="4.4" onClick={handleLogout}>
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

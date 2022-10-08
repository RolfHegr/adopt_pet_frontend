import "../css/NavigationBar.css";
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router";
import AppContext from "../contexts/AppContext";
import pawLogo from "../resources/paw.png";
import React, { useContext, useEffect, useState } from "react";

export default function NavigationBar() {
  const {
    setSignupModalShow,
    showLoginModal,
    handleLogout,
    activeUser,
    isAdmin,
  } = useContext(AppContext);
  const [navStyle, setNavStyle] = useState({ dropDown: {}, greetingMenu: "" });
  const [windowWidth, setWindowWidth] = useState(getWindowSize());
  const navigate = useNavigate();

  // adds event listener to get windowWidth
  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  // fixes some css when narrow window
  useEffect(() => {
    const width = window.innerWidth;

    if (width < 576) {
      setNavStyle({
        dropDown: {
          backgroundColor: "aliceblue",
        },
        greetingMenu: "d-flex flex-direction-row p-0 w-100",
      });
    } else {
      const navStyleDefault = { dropDown: {}, greetingMenu: "" };
      if (JSON.stringify(navStyleDefault) === JSON.stringify(navStyle)) return;
      setNavStyle(navStyleDefault);
    }
  }, [navStyle, windowWidth]);

  function getWindowSize() {
    return window.innerWidth;
  }

  function createGreeting() {
    let greeting = "";
    const date = new Date();
    const hours = date.getHours();

    if (activeUser) {
      if (hours < 12)
        return (greeting = `Good Morning ${activeUser.firstName} `);
      if (hours < 18)
        return (greeting = `Good afternoon ${activeUser.firstName} `);
      else greeting = `Good Evening ${activeUser.firstName}`;
    }

    if (!activeUser) {
      if (hours < 12) greeting = "Good Morning";
      if (hours < 18) greeting = "Good afternoon";
      else greeting = "Good Evening";
    }

    return greeting;
  }

  const NavDropDownUser = () => {
    return (
      <NavDropdown
        title={createGreeting(activeUser)}
        id="nav-dropdown"
        styles={{}}
      >
        <NavDropdown.Item onClick={() => navigate("/profile")} eventKey="4.1">
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
    );
  };

  return (
    <Navbar
      collapseOnSelect
      fixed="top"
      expand="sm"
      bg="light"
      variant="light"
      id="navbar"
    >
      <Container className="p-0">
        <Navbar.Brand href="/" className="d-flex gap-1" style={{color: "#5c5a5c"}}>
          <Image
            alt="pet logo"
            className="mx-1"
            height={30}
            src={pawLogo}
            width={30}
          />
          <div>
          Adoptify

          </div>
        </Navbar.Brand>
        <Navbar.Toggle id="nav-toggler" aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" style={navStyle.dropDown}>
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
            <div
              id="greet-drop-down"
              className={
                navStyle.greetingMenu
                  ? navStyle.greetingMenu
                  : "d-flex flex-direction-row justify-content-end w-100 justify-flex-end"
              }
            >
              {!activeUser && (
                <Nav.Link onClick={showLoginModal}>Login</Nav.Link>
              )}
              {!activeUser && (
                <Nav.Link onClick={() => setSignupModalShow(true)}>
                  Sign-up
                </Nav.Link>
              )}{" "}
              {/* {activeUser && (
                <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
              )} */}
              {activeUser && NavDropDownUser()}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

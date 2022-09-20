import "../css/LandingPage.css";
import { Container, Button } from "react-bootstrap";
import AppContext from "../contexts/AppContext";
import LandingPageImg from "../resources/landingpage/landing-page-img.png";
import logo from "../resources/landingpage/logo.png";
import React, { useContext } from "react";

export default function LandingPage() {
  const { showSignupModal, showLoginModal } = useContext(AppContext);

  return (
    <>
      <Container
        id="c-LogoTitle"
        className="d-flex gap-2 align-items-center justify-content-center mt-5"
      >
        <img src={logo} alt="page logo" />
        <h1 className="title fw-light m-0">Adoptify</h1>
      </Container>
      <Container className="c-LandingPage d-flex px-5 align-items-center justify-content-center">
        <Container className="c-CTA-IMG  h-100 w-100 d-flex justify-content-center align-items-center ">
          <Container id="c-adopt-virtual-pet" className="d-flex flex-column h-100 justify-content-center gap-4">
            <h1 id="h1-AdoptVirtualPet" className="my-4 fw-lighter">
              ADOPT <span className="emphasized">VIRTUAL</span> PET
            </h1>
            <p className="my-2 lh-base fw-light ">
              Want to feel better about yourself? Adoptify help you with just
              that. Sign up and discover all kinds of pets. When you find a pet
              you like you can adopt it. If you're not sure, you can always
              foster the pet first.
              <br></br>
              <br></br>
              <span role="button" onClick={showLoginModal}>
                {" "}
                Already a user? <span className=" text-decoration-underline"> Login</span>.
              </span>
            </p>
            <div className="d-flex gap-5 my-2">
              <Button className="btn-lg" onClick={showSignupModal}>Register</Button>
            </div>
          </Container>
          <Container id="c-lp-img" className="d-flex align-items-center h-100">
            <img
              src={LandingPageImg}
              onClick={showLoginModal}
              role="button"
              id="LandingPageImg"
              alt="man walking dog"
            />
          </Container>
        </Container>
      </Container>
    </>
  );
}

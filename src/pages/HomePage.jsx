import "../css/HomePage.css";
import { Button, Carousel, Container } from "react-bootstrap";
import { GreetingHeader } from "../components/GreetingHeader.jsx";
import AppContext from "../contexts/AppContext";
import React, { useContext } from "react";

export default function HomePage() {
  const { navigate } = useContext(AppContext);

  return (
    <div className="c-display-info d-flex gap-2 ">
      <Container className="border-none box-container w-100 p-4 mt-2 d-flex justify-content-center flex-column">
        <GreetingHeader />

        <div className="mt-3">
          <Button size="lg" onClick={() => navigate("/search-pets")}>
            Explore Pets
          </Button>
        </div>
        <Carousel
          className="mt-4"
          style={{ maxWidth: "100%", maxHeight: "60vh" }}
        >
          <Carousel.Item>
            <img
              alt="First slide"
              className="d-block w-100"
              src="https://www.pupvine.com/wp-content/uploads/2021/06/Black-Poodle-Exploring-Popular-And-Rare-Poodle-Coat-Colors.jpg"
            />
            <Carousel.Caption>
              <h3>Be a good person</h3>
              <p>Adopt a fake animal today</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://media.istockphoto.com/photos/eastern-indigo-snake-on-white-background-picture-id146732298?k=20&m=146732298&s=612x612&w=0&h=NJ9glP0UWqO1RLDyCl7mpcWdkdAlTbJODkDfRrx0i5A="
              alt="Second slide"
            />

            <Carousel.Caption>
              <h3>Save this pet</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://a-z-animals.com/media/2021/12/duckling-four-picture-id153728113-1024x535.jpg"
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>You can even save ducks</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
    </div>
  );
}

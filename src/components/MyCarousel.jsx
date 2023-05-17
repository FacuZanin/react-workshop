import React from 'react';
import { Carousel } from 'react-bootstrap';
import Carousel1 from './images/Carousel1.jpg'
import Carousel2 from './images/Carousel2.jpg'
import Carousel3 from './images/Carousel3.jpg'

const MyCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Carousel1}
          alt="Slide 1"
        />
        <Carousel.Caption>
          <h3>Slide 1</h3>
          <p>Descripción del slide 1</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Carousel2}
          alt="Slide 2"
        />
        <Carousel.Caption>
          <h3>Slide 2</h3>
          <p>Descripción del slide 2</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Carousel3}
          alt="Slide 3"
        />
        <Carousel.Caption>
          <h3>Slide 3</h3>
          <p>Descripción del slide 3</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default MyCarousel;

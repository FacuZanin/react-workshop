import { Carousel } from 'react-bootstrap';
import Carousel1 from '../../assets/images/Carousel1.jpg';
import Carousel2 from '../../assets/images/Carousel2.jpg';
import Carousel3 from '../../assets/images/Carousel3.jpg';

const slides = [
  {
    src: Carousel1,
    alt: 'Slide 1',
    title: 'Slide 1',
    description: 'Descripción del slide 1',
  },
  {
    src: Carousel2,
    alt: 'Slide 2',
    title: 'Slide 2',
    description: 'Descripción del slide 2',
  },
  {
    src: Carousel3,
    alt: 'Slide 3',
    title: 'Slide 3',
    description: 'Descripción del slide 3',
  },
];

const MyCarousel = () => {
  return (
    <Carousel fade interval={4000} pause="hover">
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={slide.src} alt={slide.alt} />
          <Carousel.Caption>
            <h3>{slide.title}</h3>
            <p>{slide.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MyCarousel;

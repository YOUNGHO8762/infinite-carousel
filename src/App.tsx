import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import './App.css';

const images = ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'];

const slideImages = [...images, images.at(0)];

const App = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimation, setIsAnimation] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleSizeChange = useCallback(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleSizeChange);
    return () => {
      window.removeEventListener('resize', handleSizeChange);
    };
  }, [handleSizeChange]);

  const changeCurrentImageIndex = useCallback(() => {
    const lastImageIndex = slideImages.length - 1;

    if (currentImageIndex === lastImageIndex) {
      setIsAnimation(false);
      setCurrentImageIndex(0);
      return;
    }

    setIsAnimation(true);
    setCurrentImageIndex(currentImageIndex + 1);
  }, [currentImageIndex]);

  const SlideDelay = isAnimation ? 3000 : 0;

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      changeCurrentImageIndex();
    }, SlideDelay);

    return () => clearInterval(interval);
  }, [changeCurrentImageIndex, SlideDelay, isHovered]);

  const handleSlideDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const checkDotSelected = (index: number) => {
    const isDotSelected =
      currentImageIndex === index ||
      currentImageIndex - images.length === index;

    return isDotSelected;
  };

  const handleMouseHover = () => {
    setIsHovered((prevState) => !prevState);
  };

  const currentTranslateX = -currentImageIndex * 100 + '%';

  return (
    <Container onMouseEnter={handleMouseHover} onMouseLeave={handleMouseHover}>
      <Contents isAnimation={isAnimation} currentTranslateX={currentTranslateX}>
        {slideImages.map((slideImage, index) => (
          <Image
            key={index}
            src={slideImage}
            width={size.width}
            height={size.height}
          />
        ))}
      </Contents>
      <Dots>
        {images.map((_, index) => (
          <Dot
            key={index}
            onClick={() => handleSlideDotClick(index)}
            isDotSelected={checkDotSelected(index)}
          />
        ))}
      </Dots>
    </Container>
  );
};

export default App;

const Container = styled.div`
  overflow: hidden;
  position: relative;
`;

const Contents = styled.div<{
  currentTranslateX: string;
  isAnimation: boolean;
}>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(${({ currentTranslateX }) => currentTranslateX});
  transition: ${({ isAnimation }) => (isAnimation ? '700ms' : '0ms')};
`;

const Image = styled.img`
  min-width: 100%;
  object-fit: cover;
`;

const Dots = styled.ul`
  display: flex;
  position: absolute;
  left: 6%;
  top: 80%;
`;

const Dot = styled.li<{ isDotSelected: boolean }>`
  width: 45px;
  height: 7px;
  margin: 0 3px;
  background-color: ${({ isDotSelected }) =>
    isDotSelected ? 'rgb(0, 92, 223)' : 'white'};
  border-radius: 10px;
  cursor: pointer;
`;

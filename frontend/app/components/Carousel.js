"use client";

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Update the array below with the paths to your food images.
  // For example, if your images are in public/images, ensure they are accessible.
  const images = [
    "/Images/Apple.jpg",
    "/Images/Banana.jpg",
    "/Images/bell pepper.jpg",
    "/Images/blueberries.jpg",
    "/Images/Bread.jpg",
    "/Images/Broccoli.jpg",
    "/Images/Butter.jpg",
    "/Images/Carrot.jpg",
    "/Images/Cereal.jpg",
    "/Images/Cheese.jpg",
    "/Images/Chicken Breast.jpg",
    "/Images/Coffee.jpg",
    "/Images/Cooking Oil.jpg",
    "/Images/Eggs.jpg",
    "/Images/Grapes.jpg",
    "/Images/Ground Beef.jpg",
    "/Images/Milk.jpg",
    "/Images/Onions.jpg",
    "/Images/Orange.jpg",
    "/Images/Pasta.jpg",
    "/Images/Peanut Butter.jpg",
    "/Images/Pineapple.jpg",
    "/Images/Potatoes.jpg",
    "/Images/Rice.jpg",
    "/Images/Spinach.jpg",
    "/Images/Strawberries.jpg",
    "/Images/Sugar.jpg",
    "/Images/Tomato Sauce.jpg",
    "/Images/Tomatoes.jpg",
    // Add more images as needed...
  ];

  return (
    <div className="flex justify-center my-8">
      <div className="w-[900px] bg-white">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index}>
              {/* 
                h-[300px]: consistent height
                w-auto + object-contain: ensure the image is fully visible
              */}
              <img
                src={img}
                alt={`Food item ${index + 1}`}
                className="h-[200px] w-auto object-contain mx-auto bg-white"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}



export default Carousel;

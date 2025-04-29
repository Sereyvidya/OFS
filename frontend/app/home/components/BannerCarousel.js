"use client";

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-black rounded-full p-2 shadow"
    >
      <FaArrowRight />
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-black rounded-full p-2 shadow"
    >
      <FaArrowLeft />
    </div>
  );
}

const banners = [
  "/banners/banner1.png",
  "/banners/banner2.png",
  "/banners/banner3.png",
  "/banners/banner4.png",
  "/banners/banner5.png",
  "/banners/banner6.png",
  "/banners/banner7.png",
];

const BannerCarousel = ({
  showLogin,
  showSignup,
  showProfile,
  showCart,
  showDeliveryAddress,
  showOrderSummary,
  showHistory
}) => {

  const anyOpen = [
    showLogin,
    showSignup,
    showProfile,
    showCart,
    showDeliveryAddress,
    showOrderSummary,
    showHistory
  ].some(Boolean);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: !anyOpen,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full mt-6">
      <Slider {...settings}>
        {banners.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="w-full h-[260px] sm:h-[320px] md:h-[400px] object-contain bg-white"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;

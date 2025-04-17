"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const DeliveryAddress = ({
  onClose,
  setShowCart,
  address,
  setAddress,
  setShowPaymentInformation,
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_ACCESS_TOKEN });

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-121.8863, 37.3382], // San Jose
      zoom: 11,
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      // Set or move the marker
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }

      try {
        const response = await geocodingClient
          .reverseGeocode({
            query: [lng, lat],
            types: ["address"],
          })
          .send();

        const feature = response.body.features[0];
        if (feature && feature.place_name.toLowerCase().includes("san jose")) {
          const context = feature.context || [];
          const getContext = (id) =>
            context.find((c) => c.id.includes(id))?.text || "";

          setAddress({
            street: feature.text || "",
            city: getContext("place") || "San Jose",
            state: getContext("region") || "",
            zip: getContext("postcode") || "",
          });

          setErrorMessage("");
        } else {
          setAddress({ street: "", city: "", state: "", zip: "" });
          setErrorMessage("Only addresses within San Jose, California are allowed.");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Unable to detect address. Please try again.");
      }
    });
  }, [geocodingClient, setAddress]);

  const isAddressComplete =
    address.street && address.city && address.state && address.zip;

  const handleNextClick = async (e) => {
    e.preventDefault();
    if (isAddressComplete) {
      onClose();
      setShowPaymentInformation(true);
    } else {
      setErrorMessage("Please select a valid address in San Jose, California.");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl m-auto bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-sky-950">Select Delivery Address</h2>
        <button
          className="bg-gray-300 px-2 rounded hover:bg-gray-400 hover:scale-103 shadow"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div
        ref={mapContainer}
        className="w-full h-64 rounded shadow border"
      />

      {address.street && (
        <div className="text-sm text-gray-700">
          <strong>Selected Address:</strong> {address.street}, {address.city},{" "}
          {address.state} {address.zip}
        </div>
      )}

      {errorMessage && (
        <div className="text-red-600 text-sm">{errorMessage}</div>
      )}

      <div className="mt-4 flex justify-between">
        <button
          className="border border-blue-300 bg-blue-600 text-white hover:bg-blue-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            setShowCart(true);
          }}
        >
          Go Back
        </button>
        <button
          className="border border-green-300 bg-green-600 text-white hover:bg-green-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
          disabled={!isAddressComplete}
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryAddress;

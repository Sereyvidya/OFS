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
  setShowOrderSummary,
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
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-121.8863, 37.3382], // San Jose
      zoom: 11,
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      // Set or move the marker

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

          let num = ""
          if (feature.address != null) {
            num += feature.address + " "
          }
          setAddress({
            street: num + feature.text || "",
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
      setShowOrderSummary(true);
    } else {
      setErrorMessage("Please select a valid address in San Jose, California.");
    }
  };

  return (
    <div className="flex flex-col w-110 h-auto m-auto bg-[#f1f0e9] rounded-lg shadow-lg">
      <div className="relative bg-[#41644a] border-2 border-[#90b89b4d] text-white flex justify-between items-center h-20 px-4 py-4 rounded-t-lg">
        <h1 className="absolute left-1/2 top-4 transform -translate-x-1/2 font-display text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">Your Address</h1>
        <button
          className="absolute right-4 top-4 bg-[#f1f0e9] border border-[#90b89b] text-[#41644a] px-2 rounded hover:bg-[#73977b] hover:scale-103 shadow transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
      </div>

      <div className="border-2 border-gray-400 rounded-b-lg flex flex-col gap-4 py-4">
        <div className="px-4">
          <div
            ref={mapContainer}
            className="w-full h-64 rounded shadow text-[#f1f0e9]"
          />
          <p className="mt-2 text-sm text-gray-400 italic">© Mapbox © OpenStreetMap Improve this map</p>

          {address.street ? (
              <div className="mt-2">
                <p className="font-semibold text-[#0d4715]">Selected Address:</p> 
                <p className="text-[#41644a]">{address.street}, {address.city},{" "}{address.state} {address.zip}</p>
              </div>
            ) : (
              <div className="mt-2">
                <p className="font-semibold text-[#0d4715]">Selected Address:</p> 
                <p className="text-sm text-gray-400 italic">Please click on the map to choose address.</p>
              </div>
            )
          }

        {errorMessage && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}
        </div>


        <div className="flex justify-between px-4">
          <button
            className="bg-[#e9762b] border border-orange-300 text-[#f1f0e9] hover:bg-orange-400 text-[#f1f0e9] hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              setShowCart(true);
            }}
          >
            Go Back
          </button>
          <button
            className="border border-green-300 bg-green-600 text-[#f1f0e9] hover:bg-green-400 hover:scale-103 shadow transition-colors cursor-pointer whitespace-nowrap py-2 px-4 rounded-lg shadow-md text-lg"
            disabled={!isAddressComplete}
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;

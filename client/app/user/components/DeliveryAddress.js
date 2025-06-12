"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { useUserContext } from "../context/UserContext";

/**
 * Renders a map for user to select their delivery address.
 */
const DeliveryAddress = () => {
  const {
    MAPBOX_ACCESS_TOKEN,
    setShowDeliveryAddress,
    setShowCart,
    address,
    setAddress,
    setShowOrderSummary,
  } = useUserContext();

  // Input mapbox token for loading the map
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  // Input mapbox token for geocoding
  const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_ACCESS_TOKEN });

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-121.8863, 37.3382], // San Jose
      zoom: 11,
      attributionControl: false,
    });

    mapRef.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      // Create and store new marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const newMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markerRef.current = newMarker;

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

          let num = "";
          if (feature.address != null) {
            num += feature.address + " ";
          }
          setAddress({
            street: num + feature.text || "",
            city: getContext("place") || "San Jose",
            state: getContext("region") || "",
            zip: getContext("postcode") || "",
            lat: lat,
            lng: lng,
          });

          setErrorMessage("");
        } else {
          setAddress({ street: "", city: "", state: "", zip: "" });
          setErrorMessage(
            "Please select a valid address in San Jose, California.",
          );
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
    if (isAddressComplete) {
      setShowDeliveryAddress(false);
      setShowOrderSummary(true);
    } else {
      setErrorMessage("Please select a valid address in San Jose, California.");
    }
  };

  return (
    <div className="m-auto flex h-auto w-110 flex-col rounded-lg bg-[#f1f0e9] shadow-lg">
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-white">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Your Address
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => setShowDeliveryAddress(false)}
        >
          &times;
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-b-lg border-2 border-gray-400 py-4 focus:outline-none">
        <div className="px-4">
          <div
            ref={mapContainer}
            tabIndex={0}
            className="h-64 w-full rounded text-black shadow"
          />
          <p className="mt-2 text-sm text-gray-400 italic">
            <a
              href="https://www.mapbox.com/about/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 focus:text-gray-500 focus:outline-none"
            >
              © Mapbox
            </a>{" "}
            <a
              href="https://www.openstreetmap.org/copyright/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 focus:text-gray-500 focus:outline-none"
            >
              © OpenStreetMap
            </a>{" "}
            <a
              href="https://labs.mapbox.com/contribute/#/?owner=mapbox&id=streets-v12&access_token=pk.eyJ1IjoidmljaGlhc2VlZCIsImEiOiJjbTlqams5ajUwYjNrMmpxMmMyNmZrZGd5In0.YxqyUv8zFYPN-pk043DQ2A&utm_source=http%3A%2F%2Flocalhost%3A3000%2F&utm_medium=attribution_link&utm_campaign=referrer&l=11%2F37.3382%2F-121.8863&q="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 focus:text-gray-500 focus:outline-none"
            >
              Improve this map
            </a>
          </p>

          {address.street ? (
            <div className="mt-2">
              <p className="font-semibold text-[#0d4715]">Selected Address:</p>
              <p className="text-[#41644a]">
                {address.street}, {address.city}, {address.state} {address.zip}
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="font-semibold text-[#0d4715]">Selected Address:</p>
              <p className="text-sm text-gray-400 italic">
                Please click on the map to choose address.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="text-sm text-red-600">{errorMessage}</div>
          )}
        </div>

        <div className="flex justify-between px-4">
          <button
            className="cursor-pointer rounded-lg border-2 border-orange-300 bg-[#e9762b] px-4 py-2 text-lg whitespace-nowrap text-[#f1f0e9] shadow shadow-md transition-colors hover:scale-103 hover:bg-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              setShowDeliveryAddress(false);
              setShowCart(true);
            }}
          >
            Go Back
          </button>
          <button
            className="cursor-pointer rounded-lg border-2 border-green-300 bg-green-600 px-4 py-2 text-lg whitespace-nowrap text-[#f1f0e9] shadow shadow-md transition-colors hover:scale-103 hover:bg-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onClick={handleNextClick}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;

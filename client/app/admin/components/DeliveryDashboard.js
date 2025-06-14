"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAdminContext } from "../context/AdminContext";
import mapboxgl from "mapbox-gl";
import mbxOptimization from "@mapbox/mapbox-sdk/services/optimization";
import { getAllAwaitingOrders, putDeliveredOrder } from "../../api/OrderRoutes";

const DeliveryDashboard = () => {
  const {
    setShowDeliveryDashboard,
    API_URL,
    MAPBOX_ACCESS_TOKEN,
    awaitingOrders,
    setAwaitingOrders,
  } = useAdminContext();

  const [batch, setBatch] = useState([]);
  const [overflow, setOverflow] = useState([]);
  const [batchLoaded, setBatchLoaded] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
  const optimizationClient = mbxOptimization({
    accessToken: MAPBOX_ACCESS_TOKEN,
  });

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const robotMarkerRef = useRef(null);
  const robotPosition = useRef({ lat: 37.335, lng: -121.881 });
  const orderMarkersRef = useRef({});

  const fetchAllAwaitingOrders = async () => {
    const { ok, data } = await getAllAwaitingOrders(API_URL);
    if (ok) {
      setAwaitingOrders(data);
      const { batch, overflow } = getBatchAndOverflow(data);
      setBatch(batch);
      setOverflow(overflow);
      return batch;
    }
  };

  const getBatchAndOverflow = (orders) => {
    const batch = [];
    const overflow = [];
    let totalWeight = 0;
    for (const order of orders) {
      const w = parseFloat(order.weight);
      if (batch.length < 10 && totalWeight + w <= 200) {
        batch.push(order);
        totalWeight += w;
      } else {
        overflow.push(order);
      }
    }
    return { batch, overflow };
  };

  const previewRoute = async (batchOrders) => {
    if (!mapRef.current || batchOrders.length === 0) return;

    const waypoints = [
      { coordinates: [robotPosition.current.lng, robotPosition.current.lat] },
      ...batchOrders.map((o) => ({ coordinates: [o.lng, o.lat] })),
    ];

    const res = await optimizationClient
      .getOptimization({
        profile: "driving",
        geometries: "geojson",
        source: "first",
        destination: "last",
        roundtrip: false,
        waypoints,
      })
      .send();

    const route = res.body.trips[0].geometry.coordinates;

    // Draw preview route
    if (mapRef.current.getSource("preview")) {
      mapRef.current.removeLayer("preview");
      mapRef.current.removeSource("preview");
    }

    mapRef.current.addSource("preview", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: route },
      },
    });

    mapRef.current.addLayer({
      id: "preview",
      type: "line",
      source: "preview",
      paint: {
        "line-color": "#90b89b",
        "line-width": 4,
      },
    });
  };

  const interpolate = (start, end, steps) => {
    const [startLng, startLat] = start;
    const [endLng, endLat] = end;

    const result = [];
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      result.push([
        startLng + t * (endLng - startLng),
        startLat + t * (endLat - startLat),
      ]);
    }
    return result;
  };

  const deliverBatch = async () => {
    if (batch.length === 0) return;

    const waypoints = [
      { coordinates: [robotPosition.current.lng, robotPosition.current.lat] },
      ...batch.map((o) => ({ coordinates: [o.lng, o.lat] })),
    ];

    const res = await optimizationClient
      .getOptimization({
        profile: "driving",
        geometries: "geojson",
        source: "first",
        destination: "last",
        roundtrip: false,
        waypoints,
      })
      .send();

    const trip = res.body.trips[0];
    const ordered = res.body.waypoints
      .filter((wp) => wp.waypoint_index > 0)
      .sort((a, b) => a.waypoint_index - b.waypoint_index)
      .map((wp) => batch[wp.waypoint_index - 1]);
    setBatch(ordered);

    const rawRoute = trip.geometry.coordinates;
    const route = [];
    for (let i = 0; i < rawRoute.length - 1; i++) {
      route.push(...interpolate(rawRoute[i], rawRoute[i + 1], 10)); // smoother by 5x
    }

    const deliveryPoints = batch.map((o) => [o.lng, o.lat]);

    // Remove old layers
    if (mapRef.current.getSource("preview")) {
      mapRef.current.removeLayer("preview");
      mapRef.current.removeSource("preview");
    }
    if (mapRef.current.getSource("route")) {
      mapRef.current.removeLayer("route");
      mapRef.current.removeSource("route");
    }

    // Add delivery route
    mapRef.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: route },
      },
    });
    mapRef.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      paint: {
        "line-color": "#41644a",
        "line-width": 4,
      },
    });

    // Animate delivery
    let i = 0;

    // For when the robot stops moving
    let lastPosition = null;
    let stillCount = 0;
    const step = async () => {
      // Clean up
      if (i >= route.length && batch.length === 0) {
        if (mapRef.current.getSource("route")) {
          mapRef.current.removeLayer("route");
          mapRef.current.removeSource("route");
        }

        setBatch([]);
        setBatchLoaded(false);
        setIsDeploying(false);

        robotPosition.current = { lat: 37.335, lng: -121.881 };
        robotMarkerRef.current.setLngLat([
          robotPosition.current.lng,
          robotPosition.current.lat,
        ]);

        toast.success("Batch delivered!");
        return;
      }

      const [lng, lat] = route[i] || route[route.length - 1];
      robotPosition.current = { lat, lng };
      robotMarkerRef.current.setLngLat([lng, lat]);

      const moved = lastPosition
        ? Math.hypot(lastPosition[0] - lng, lastPosition[1] - lat) < 0.00001
        : false;
      if (moved) {
        stillCount++;
      } else {
        stillCount = 0;
      }
      lastPosition = [lng, lat];

      let closestIndex = -1;
      let minDist = Infinity;
      for (let j = 0; j < batch.length; j++) {
        const [orderLng, orderLat] = [batch[j].lng, batch[j].lat];
        const dist = Math.hypot(orderLng - lng, orderLat - lat);
        if (dist < minDist) {
          minDist = dist;
          closestIndex = j;
        }
      }

      // Activates when robot is within 0.001 dist of an order
      // or if it can't any closer
      if ((minDist < 0.001 || stillCount > 10) && closestIndex !== -1) {
        const order = batch[closestIndex];
        const { ok } = await putDeliveredOrder(API_URL, order.orderID);
        if (ok) {
          toast.success(`Delivered order #${order.orderID}`);

          if (orderMarkersRef.current[order.orderID]) {
            orderMarkersRef.current[order.orderID].remove();
            delete orderMarkersRef.current[order.orderID];
          }

          batch.splice(closestIndex, 1);
          deliveryPoints.splice(closestIndex, 1);

          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      i++;

      setTimeout(step, 50);
    };

    step();
  };

  // Render the map and fetch order
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-121.8863, 37.3382],
        zoom: 12,
      });

      setTimeout(() => {
        mapRef.current.resize();
      }, 100);
    }
    fetchAllAwaitingOrders();
  }, []);

  // Set robot's marker
  useEffect(() => {
    const { lat, lng } = robotPosition.current;
    const marker = new mapboxgl.Marker({ color: "#41644a" })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setText("Delivery Robot"))
      .addTo(mapRef.current);
    robotMarkerRef.current = marker;
  }, []);

  // Set current the markers for orders in current batch
  useEffect(() => {
    if (!mapRef.current || batch.length === 0) return;

    Object.values(orderMarkersRef.current).forEach((m) => m.remove());
    orderMarkersRef.current = {};

    batch.forEach((order) => {
      if (order.lat != null && order.lng != null) {
        const marker = new mapboxgl.Marker({ color: "#e9762b" })
          .setLngLat([order.lng, order.lat])
          .setPopup(new mapboxgl.Popup().setText(`Order #${order.orderID}`))
          .addTo(mapRef.current);
        orderMarkersRef.current[order.orderID] = marker;
      }
    });
  }, [batch]);

  return (
    <div className="flex h-[80vh] w-[80vw] flex-col overflow-hidden rounded-lg shadow">
      {/* Sidebar */}
      <div className="relative flex h-20 items-center justify-between rounded-t-lg border-2 border-[#90b89b4d] bg-[#41644a] px-4 py-4 text-[#f1f0e9]">
        <h1 className="font-display absolute top-4 left-1/2 -translate-x-1/2 transform text-4xl font-bold text-[#f1f0e9] [text-shadow:_0_1px_3px_#73977b]">
          Delivery Dashboard
        </h1>
        <button
          className="absolute top-4 right-4 rounded border border-[#90b89b] bg-[#f1f0e9] px-2 text-[#41644a] shadow transition-colors hover:scale-103 hover:bg-[#73977b] focus:ring-2 focus:ring-[#73977b] focus:outline-none"
          onClick={() => {
            setShowDeliveryDashboard(false);
          }}
        >
          &times;
        </button>
      </div>

      <div className="flex h-full flex-row rounded-b-lg border-2 border-gray-400">
        <div className="relative flex w-1/3 flex-col rounded-bl-md bg-[#f1f0e9]">
          <h2 className="pt-2 text-center text-lg font-semibold text-[#41644a]">
            Current Batch ({batch.length})
          </h2>

          <div className="flex max-h-52 flex-col space-y-4 overflow-y-scroll px-4 py-2">
            {batch.map((order) => (
              <div key={order.orderID} className="rounded p-2 text-sm shadow">
                <p className="font-medium text-[#41644a]">
                  Order #{order.orderID}
                </p>
                <p className="text-[#41644a]">{order.street}</p>
                <p className="text-xs text-[#41644a]">
                  {order.city}, {order.state} {order.zip}
                </p>
                <p className="text-xs text-orange-400">
                  Weight: {order.weight} lbs
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-center text-lg font-semibold text-[#41644a]">
            Remaining Orders ({overflow.length})
          </h2>
          <div className="flex max-h-37 flex-col space-y-4 overflow-y-scroll px-4 pt-2">
            {overflow.map((order) => (
              <div key={order.orderID} className="rounded p-2 text-sm shadow">
                <p className="font-medium text-[#41644a]">
                  Order #{order.orderID}
                </p>
                <p className="text-[#41644a]">{order.street}</p>
                <p className="text-xs text-[#41644a]">
                  {order.city}, {order.state} {order.zip}
                </p>
                <p className="text-xs text-orange-400">
                  Weight: {order.weight} lbs
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={async () => {
              if (batchLoaded) {
                setIsDeploying(true);
                await deliverBatch();
                setBatchLoaded(false);
                setIsDeploying(false);
              } else {
                const newBatch = await fetchAllAwaitingOrders();
                await previewRoute(newBatch);
                setBatchLoaded(true);
              }
            }}
            disabled={
              (batch.length === 0 && overflow.length === 0) || isDeploying
            }
            className={`absolute right-4 bottom-4 left-4 rounded py-2 text-[#f1f0e9] shadow ${
              (batch.length === 0 && overflow.length === 0) || isDeploying
                ? "cursor-not-allowed bg-gray-400"
                : batchLoaded
                  ? "cursor-pointer rounded-lg border-2 border-green-300 bg-green-600 px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-102 hover:bg-green-400 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  : "cursor-pointer rounded-lg border-2 border-orange-300 bg-[#e9762b] px-4 py-2 font-semibold whitespace-nowrap text-[#f1f0e9] shadow transition-colors hover:scale-102 hover:bg-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            }`}
          >
            {batchLoaded ? "Deploy" : "Load Batch"}
          </button>
        </div>

        {/* Map */}
        <div ref={mapContainer} className="flex-1 rounded-br-md" />
      </div>
    </div>
  );
};

export default DeliveryDashboard;

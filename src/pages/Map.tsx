"use client";
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Coords } from "@/types/Coords";
import { getAllPoints, addConnectionToPoint, getConnectionsById } from "@/api";
import { FaSitemap } from "react-icons/fa";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { toast } from "react-toastify";

const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const addIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface MapProps {
  add: { poiToAdd: Coords | null | undefined; setPoiToAdd: any };
  update: { poiToUpdate: any; setPoiToUpdate: any };
  points: any[];
  setPoints: any;
  shortestPath: any;
}

const Map: React.FC<MapProps> = ({
  add,
  update,
  points,
  setPoints,
  shortestPath,
}) => {
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [connectedPoints, setConnectedPoints] = useState<number[]>([]);
  const [shortestPoints, setShortestPoints] = useState<any[]>([]);

  const [connectedPointsOfSelectedPoi, setConnectedPointsOfSelectedPoi] =
    useState<any[]>([]);

  useEffect(() => {
    const selectedCoords = shortestPath?.points.map((ele: any, idx: number) => {
      return { lat: ele?.coords.lattitude, lng: ele?.coords.longitude };
    });

    console.log(selectedCoords);
    setShortestPoints(selectedCoords);
  }, [shortestPath]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const pointsData = await getAllPoints();
        console.log(pointsData);
        setPoints(pointsData);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchPoints();
  }, []);

  const getAllConnectedPoints = async (point: any) => {
    const data = await getConnectionsById(point.id);

    const multiplePolyLineData = data.map((ele: any) => {
      return [
        { lat: point.coords?.lattitude, lng: point.coords?.longitude },
        { lat: ele.coords?.lattitude, lng: ele.coords?.longitude },
      ];
    });

    setConnectedPointsOfSelectedPoi(multiplePolyLineData);
  };

  const handleMarkerClick = (pointId: number, point: any) => {
    setSelectedPoints((prevSelectedPoints) => {
      const newSelectedPoints = [...prevSelectedPoints, pointId];
      update.setPoiToUpdate([...update.poiToUpdate, point]);
      if (newSelectedPoints.length >= 2) {
        console.log(newSelectedPoints);
      }

      return newSelectedPoints;
    });
  };

  const handleUpdateConnection = async () => {
    if (selectedPoints.length >= 2) {
      try {
        await addConnectionToPoint(
          selectedPoints.filter((ele: any, idx: number) => idx != 0),
          selectedPoints[0]
        );
        toast("added the path",{type:'success'});
        console.log("Connection added successfully");
        setConnectedPoints((prevConnectedPoints) => [
          ...prevConnectedPoints,
          ...selectedPoints,
        ]);

        setSelectedPoints([]);
      } catch (error) {
        console.error("Error adding connection:", error);
        toast("error ");
        setSelectedPoints([]);
      }
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (isAdd) {
          const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
          console.log(newPoint);
          add.setPoiToAdd(newPoint);
        
          
        }
      },
    });
    return null;
  };

  return (
    <div className="col-span-5 relative">
      <div className="absolute bottom-0 right-0 z-10 h-32 w-full  flex justify-between items-center p-4">
        <button
          className="bg-white p-2 text-lg rounded-full h-12 w-12 border-2 border-blue-800"
          onClick={() => {
            setIsAdd(!isAdd);
          }}
        >
          {isAdd ? "❌" : "➕"}
        </button>
        {selectedPoints.length >= 2 && (
          <button
            className="bg-white p-2 text-lg rounded-full h-12 w-12"
            onClick={handleUpdateConnection}
          >
            ✏️
          </button>
        )}
      </div>
      <MapContainer
        center={[21.202225662304457, 85.81724140978505]}
        zoom={4}
        className="w-full h-screen z-0"
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=k7YwbaYRaFqydorqS71L"

          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {points.map((point, idx) => (
          <Marker
            key={idx}
            position={[point.coords?.lattitude, point?.coords.longitude]}
            icon={defaultIcon}
          >
            <Popup>
              <div>
                <h4 className="font-semibold">Poi Details</h4>
                <p>{point.id}</p>
                <p>{point.name}</p>
                <div className="flex items-center justify-center gap-x-4">
                  <div
                    onClick={() => {
                      getAllConnectedPoints(point);
                    }}
                    className="bg-blue-500 p-2 rounded-lg text-white"
                  >
                    <FaSitemap />
                  </div>
                  <div
                    onClick={() => {
                      handleMarkerClick(point.id, point);
                    }}
                    className="bg-red-500 p-2 rounded-lg text-white"
                  >
                    <MdOutlineAddLocationAlt />
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {shortestPoints?.length >= 2 && (
          <Polyline positions={shortestPoints} color="blue" />
        )}

        {isAdd && add.poiToAdd && (
          <Marker
            position={[add.poiToAdd.lat, add.poiToAdd.lng]}
            icon={addIcon}
          />
        )}

        {connectedPointsOfSelectedPoi && (
          <>
            {connectedPointsOfSelectedPoi?.map((ele: any) => {
              return <Polyline positions={ele} color="green" />;
            })}
          </>
        )}

        <MapEvents />
      </MapContainer>
    </div>
  );
};

export default Map;

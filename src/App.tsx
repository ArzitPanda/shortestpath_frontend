import { useState } from "react";
import "./App.css";
import Map from "./pages/Map";
import { Coords } from "./types/Coords";
import { addPoint, getAllConnectedPoints, getShortestPath } from "./api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [poiToAdd, setPoiToadd] = useState<Coords | null>();
  const [poiToUpdate, setPoiToUpdate] = useState<any[]>([]);

  const [poiName, setPoiName] = useState<string>();
  const [poiType, setPoiType] = useState<string>();
  const [points, setPoints] = useState<any[]>([]);
  const [src, setSrc] = useState<number | undefined>();
  const [dest, setDest] = useState<number | undefined>();
  const [connectedNode, setConnectedNode] = useState<any[]>([]);
  const [shortestPath, setShortestPath] = useState<any>();

  const handleSavePoi = async () => {
    await addPoint({
      name: poiName,
      poiType: poiType?.toUpperCase(),
      coords: { lattitude: poiToAdd?.lat, longitude: poiToAdd?.lng },
    });
    setPoiName("");
    toast("added to map",{type:'success'});
  };

  const getshortestPathUi = async () => {
    const data = await getShortestPath(src, dest);
    console.log(data);
     
    setShortestPath(data);
  };

  // const getConnectedNode =async ()=>{
  //   const data  =await getAllConnectedPoints(poiToUpdate?.id);

  // }

  return (
    <div className="grid grid-cols-8">
      <Map
        shortestPath={shortestPath}
        points={points}
        setPoints={setPoints}
        add={{ poiToAdd, setPoiToAdd: setPoiToadd }}
        update={{ poiToUpdate, setPoiToUpdate }}
      />

      {poiToAdd && (
        <div className=" col-span-3 pt-24 bg-gray-100">
          <div className=" p-4 rounded-md shadow-md flex flex-col gap-y-4">
            <input
              type="text"
              value={poiName}
              onChange={(e) => setPoiName(e.target.value)}
              placeholder="Enter name"
              className="p-2 border rounded-md"
            />
            <select
              value={poiType}
              onChange={(e) => setPoiType(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="SCHOOL">School</option>
              <option value="COLLEGE">College</option>
              <option value="HOME">Home</option>
              <option value="SALOON">Saloon</option>
              <option value="OFFICE">Office</option>
              <option value="TEMPLE">Temple</option>
              <option value="MASJID">Masjid</option>
              <option value="CHURCH">Church</option>
            </select>
            <div className="flex items-center justify-center p-2 gap-x-2">
              <button
                className="p-2 bg-blue-500 text-white rounded-md shadow-sm"
                onClick={handleSavePoi}
              >
                Save
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded-md shadow-sm"
                onClick={() => {
                  setPoiToadd(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {poiToUpdate && poiToUpdate?.length > 0 && (
        <div className="col-span-3 pt-24 bg-gray-100">
          <div className="flex flex-col">
            {poiToUpdate.map((ele,idx:number) => {
              return (
                <div className="bg-white shadow-sm w-10/12 mx-auto">
                  {idx===0?<h1 className="bg-blue-500 p-2 text-white font-semibold text-lg">parent</h1>:<h1>connected</h1>}
                  <h2 className="text-lg font-semibold px-4">id: {ele?.id}</h2>
                  <h4 className="text-lg lowercase px-4">{ele?.name}</h4>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="col-span-3 pt-24 bg-gray-100 ">
        <div className="flex flex-col p-4 gap-y-4">
          <select
            value={src}
            onChange={(e) => setSrc(parseInt(e.target.value))}
            className="h-12 border border-slate-500"
          >
            <option value="" disabled>
              Select source
            </option>
            {points.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
          <select
            value={dest}
            onChange={(e) => setDest(parseInt(e.target.value))}
            className="h-12 border border-slate-500"
          >
            <option value="" disabled>
              Select destination
            </option>
            {points.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-center p-2 gap-x-2">
            <button
              className="p-2 rounded-md  bg-blue-700 text-white"
              onClick={getshortestPathUi}
            >
              get Distance
            </button>
          </div>
          {shortestPath && (
            <div className="text-lg font-semibold">
              total distance is {Math.round(shortestPath.distance / 1000)} kms
            </div>
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default App;

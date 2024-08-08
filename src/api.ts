import axios from 'axios';
import { PointDto } from './types/PointDto';
const API_BASE_URL = 'http://localhost:8080';




  

export const getAllPoints = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/points`);
    return response.data;
  } catch (error) {
    console.error('Error fetching points:', error);
    throw error;
  }
};



export const getAllConnectedPoints =async (pointId:number)=>{

    try {
        const response = await axios.get(`${API_BASE_URL}/points/${pointId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching points:', error);
        throw error;
      }

}


export const addPoint = async (pointDto: PointDto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/points`, pointDto);
    return response.data;
  } catch (error) {
    console.error('Error adding point:', error);
    throw error;
  }
};

export const deletePoint = async (pointId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/points/${pointId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting point:', error);
    throw error;
  }
};


export const addConnectionToPoint = async (pointIds: number[], parentId: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/points/addConnection`, pointIds, {
      params: { parentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding connection to point:', error);
    throw error;
  }
};


export const getConnectionsById =async (pointId:number|undefined) =>{

  try {
    const response = await axios.get(`${API_BASE_URL}/points/connection/${pointId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding point:', error);
    throw error;
  }

}

export const getShortestPath = async (sourceId: number| undefined, destinationId: number|undefined) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paths/shortest`, {
      params: { source: sourceId, destination: destinationId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching shortest path:', error);
    throw error;
  }
};

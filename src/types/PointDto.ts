export  interface PointDto {
    name: string | undefined;
    poiType: string | undefined; // You can use an enum if you have predefined types like 'SCHOOL'
    coords: {
      lattitude: number | undefined;
      longitude: number| undefined;
    };
  }
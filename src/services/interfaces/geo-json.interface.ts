interface GeoJSON {
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        name: string;
    };
}

export { GeoJSON };
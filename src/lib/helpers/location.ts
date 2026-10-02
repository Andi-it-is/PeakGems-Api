import * as Joi from "joi";

// GeoJSON-Point, Koordinaten in der Reihenfolge [lng, lat]
export interface GeoPoint {
    type: "Point";
    coordinates: [number, number];
}

export const pointSchema = Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().ordered(
        Joi.number().min(-180).max(180).required(),
        Joi.number().min(-90).max(90).required(),
    ).length(2).required(),
});

// Ersetzt latitude/longitude durch "location" als GeoJSON-Point (oder null), ungerundet
export function withLocationPoint<T extends { latitude?: number | null; longitude?: number | null }>(loc: T) {
    const { latitude, longitude, ...rest } = loc;
    const location: GeoPoint | null = latitude === null || latitude === undefined || longitude === null || longitude === undefined
        ? null
        : { type: "Point", coordinates: [Number(longitude), Number(latitude)] };
    return { ...rest, location };
}

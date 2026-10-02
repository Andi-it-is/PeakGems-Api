import { Request, RequestHandler, Response } from "express";
import { AppDataSource } from "../../../AppDataSource";
import { Location } from "../../../entity/Location";
import { withLocationPoint } from "../../../lib/helpers/location";

// Schlanke Liste für die Karte: nur Locations mit Koordinaten. Die Reviews werden nicht geladen,
// averageRating/totalRatings berechnet die DB per AVG/COUNT (gleiche Werte wie in /overview, 0 ohne Reviews).
export const listLocationsForMap: RequestHandler = async (req: Request, res: Response, next) => {

  try {

    const rows = await AppDataSource
      .getRepository(Location)
      .createQueryBuilder("location")
      .leftJoin("location.reviews", "review")
      .select("location.id", "id")
      .addSelect("location.name", "name")
      .addSelect("location.address", "address")
      .addSelect("location.status", "status")
      .addSelect("location.type", "type")
      .addSelect("location.city", "city")
      .addSelect("location.latitude", "latitude")
      .addSelect("location.longitude", "longitude")
      .addSelect("COALESCE(AVG(review.rating), 0)", "averageRating")
      .addSelect("COUNT(review.id)", "totalRatings")
      .where("location.latitude IS NOT NULL")
      .andWhere("location.longitude IS NOT NULL")
      // alle Spalten gruppieren, damit auch MySQL mit ONLY_FULL_GROUP_BY zufrieden ist
      .groupBy("location.id")
      .addGroupBy("location.name")
      .addGroupBy("location.address")
      .addGroupBy("location.status")
      .addGroupBy("location.type")
      .addGroupBy("location.city")
      .addGroupBy("location.latitude")
      .addGroupBy("location.longitude")
      .orderBy("location.id", "ASC")
      .getRawMany()

    const locations = rows.map(row => withLocationPoint({
      id: Number(row.id),
      name: row.name,
      address: row.address,
      status: row.status,
      type: row.type,
      city: row.city,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      // in MySQL ist rating eine FLOAT-Spalte -> Abweichung zu /overview ab der ~7. Nachkommastelle möglich
      averageRating: Number(row.averageRating),
      // COUNT kommt in Postgres als String
      totalRatings: Number(row.totalRatings),
    }))

    return res.status(200).json({
      success: true,
      data: locations,
    })

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

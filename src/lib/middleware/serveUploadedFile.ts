import { Response } from "express";
import * as path from "path";
import { UserRequest, UserRequestHandler } from "../classes/UserRequestHandler";

// Zentrale, wiederverwendbare Auslieferung für authentifizierte Uploads (Avatare, Location-Bilder, ...).
// uploadDir muss ein bereits absoluter Pfad sein (siehe lib/upload.ts), damit hier nicht nochmal
// separat und potenziell abweichend berechnet wird, wo die Dateien tatsächlich liegen.
export const serveUploadedFile = (uploadDir: string): UserRequestHandler => {
    return async (req: UserRequest, res: Response) => {
        const rawFilename = req.params.filename;
        const filename = path.basename(Array.isArray(rawFilename) ? rawFilename[0] : rawFilename);

        res.sendFile(filename, { root: uploadDir }, (err) => {
            if (err && !res.headersSent) {
                res.status(404).json({ success: false, message: "Datei nicht gefunden." });
            }
        });
    };
};

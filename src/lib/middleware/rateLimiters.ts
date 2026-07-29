import rateLimit from "express-rate-limit";

// Allgemeines Limit für alle Routen, schützt vor grobem Missbrauch/DoS.
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Zu viele Anfragen. Bitte später erneut versuchen." },
});

// Strengeres Limit für Login/Register - zusätzlich zur bestehenden failedLoginTries-Sperrlogik
// im login.ts, die pro Account greift. Dieses Limit greift pro IP, unabhängig vom Account.
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Zu viele Anfragen. Bitte später erneut versuchen." },
});

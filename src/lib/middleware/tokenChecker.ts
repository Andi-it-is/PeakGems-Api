// import { Request, Response, NextFunction } from 'express';
// import { Token, User } from '../../database/models';

// /**
//  * Middleware to validate the UUID token provided in the Authorization header.
//  * If valid, it attaches the User object to the request for use in downstream routes.
//  */
// export const tokenChecker = async (req: Request, res: Response, next: NextFunction) => {
//   // 1. Extract the token from the header
//   // Note: Standard practice is 'Authorization: <token>', but we'll accept the raw UUID for now.
//   const tokenUuid = req.headers['authorization'];

//   if (!tokenUuid) {
//     return res.status(401).json({ 
//       error: 'Unauthorized', 
//       message: 'No authorization token provided.' 
//     });
//   }

//   try {
//     // 2. Fetch the token from the database
//     // We 'include' the User model so we don't have to do a second query later.
//     const tokenRecord = await Token.findOne({
//       where: { token: tokenUuid },
//       include: [{ 
//         model: User, 
//         as: 'user',
//         attributes: { exclude: ['password'] } // Security: Never carry the password in the request object
//       }]
//     });

//     // 3. Validate the token
//     // We use the 'isActive' virtual getter we built in the Token model.
//     if (!tokenRecord || !tokenRecord.isActive) {
//       return res.status(401).json({ 
//         error: 'Unauthorized', 
//         message: 'Token is invalid, expired, or has been revoked.' 
//       });
//     }

//     // 4. Update usage stats (Optional)
//     // Useful for tracking when the user was last active.
//     tokenRecord.lastAccess = new Date();
//     await tokenRecord.save();

//     // 5. Attach the user to the request object
//     // We cast as 'any' to avoid TS errors, or you can extend the Express Request interface.
//     (req as any).user = tokenRecord.userId;

//     // 6. Move to the next middleware or route
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
//     res.status(500).json({ 
//       error: 'Internal Server Error', 
//       message: 'An error occurred during authentication.' 
//     });
//   }
// };
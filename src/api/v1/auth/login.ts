// import Joi from 'joi';

// const bodySchema = Joi.object({
//     username: Joi.string().min(3).max(30).required(),
//     password: Joi.string().required()
// });

// import { RequestHandler } from "express";
// import bcrypt from "bcrypt";
// import { sequelize, User } from "../../../database/models/index"
// import { UserRoleEnum } from '../../../lib/enums/UserRoleEnum';

// export const register: RequestHandler = async (req, res, next) => {
//     try {

//         const body = await bodySchema.validateAsync(req.body);

//         const existingUser = await User.findOne({ 
//             where: { 
//                 username: body.username 
//             } 
//         });
//         if (existingUser) {
//             return res.status(409).json({ success: false, message: "Username taken" });
//         }

//         // 3. Hash and Save
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(body.password, salt);

//         const newUser = await User.create({
//             username: body.username,
//             password: hashedPassword,
//             role: UserRoleEnum.USER
//         });

//         return res.status(201).json({
//             success: true,
//             data: { id: newUser.id, username: newUser.username }
//         });

//     } catch (error) {
//         next(error);
//     }
// }
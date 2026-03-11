import { Request, Response } from 'express';
import { AppDataSource } from '../../../AppDataSource';
import { User } from '../../../entity/User'
import * as bcrypt from 'bcrypt';
import * as Joi from "joi";
import { UserRequest } from '../../../lib/classes/UserRequestHandler';

const paramSchema = Joi.object({
  id: Joi.string().required()
})

const bodySchema = Joi.object({
  password: Joi.string().optional()
})

export const resetUserPassword = async (req: UserRequest, res: Response) => {
  try {
    const params = await paramSchema.validateAsync(req.params);
    const body = await bodySchema.validateAsync(req.body)

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: parseInt(params.id) });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Nutzer nicht gefunden' });
    }

    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(body.password, salt);
    } else {
      const defaultPassword = 'Start123!';
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(defaultPassword, salt);
    }

    await userRepository.save(user);

    return res.status(200).json({ 
      success: true, 
      message: `Passwort für ${user.username} wurde erfolgreich zurückgesetzt.` 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Fehler beim Zurücksetzen', txt: error });
  }
};
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../models/User';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const usersRepository = getRepository(User);

    const foundUserByEmail = await usersRepository.findOne({ email });

    if (foundUserByEmail) {
      return response.status(400).json({ error: 'email-already-using' });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return response.json(user);
  }
}

export { UserController };

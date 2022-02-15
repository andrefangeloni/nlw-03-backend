import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);

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

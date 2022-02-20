import { resolve } from 'path';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

import SendEmailService from '../services/SendEmailService';

import { AppError } from '../errors/AppError';

class SendEmailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError('user-not-found', 404);
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      throw new AppError('survey-not-found', 404);
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUser = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey'],
    });

    const variables = {
      id: '',
      name: user.name,
      title: survey.title,
      link: process.env.URL_MAIL,
      description: survey.description,
    };

    if (surveyUser) {
      variables.id = surveyUser.id;

      await SendEmailService.execute({
        to: email,
        subject: survey.title,
        variables,
        path: npsPath,
      });

      return response.json(surveyUser);
    }

    const surveysUsers = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveysUsers);

    variables.id = surveysUsers.id;

    await SendEmailService.execute({
      to: email,
      subject: survey.title,
      variables,
      path: npsPath,
    });

    return response.json(surveysUsers);
  }
}

export { SendEmailController };

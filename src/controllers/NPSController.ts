import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';

import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class NPSController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveysUsers.filter(({ value }) => value < 7).length;
    const promoters = surveysUsers.filter(({ value }) => value > 8).length;
    const passives = surveysUsers.filter(
      ({ value }) => value > 6 && value < 9,
    ).length;
    const totalAnswers = surveysUsers.length;

    const nps = Number(
      (((promoters - detractors) / totalAnswers) * 100).toFixed(2),
    );

    return response.json({
      nps,
      passives,
      promoters,
      detractors,
      totalAnswers,
    });
  }
}

export { NPSController };

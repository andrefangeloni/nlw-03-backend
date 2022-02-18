import { Router } from 'express';

import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendEmailController } from './controllers/SendEmailController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendEmailController = new SendEmailController();

router.post('/users', userController.create);

router.get('/surveys', surveyController.show);
router.post('/surveys', surveyController.create);

router.post('/sendEmail', sendEmailController.execute);

export { router };

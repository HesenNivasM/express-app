import { Router } from 'express';
const router = Router();
import { signUpUser, loginUser } from '../controllers/auth';
import { loginValidation, signUpValidation } from '../middleware/auth-validation';

router.post('/signup', signUpValidation, signUpUser);
router.post('/login', loginValidation, loginUser);

export default router;

import { Router } from 'express';
import { bookPublic, metadata } from '../controllers/publicBookingController.js';

const router = Router();

router.get('/metadata', metadata);
router.post('/book', bookPublic);

export default router;

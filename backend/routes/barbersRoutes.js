import { Router } from 'express';
import { createBarber, deleteBarber, listBarbers, setWorkingHours, updateBarber } from '../controllers/barbersController.js';

const router = Router();

router.get('/', listBarbers);
router.post('/', createBarber);
router.put('/:id', updateBarber);
router.delete('/:id', deleteBarber);
router.put('/:barberId/working-hours', setWorkingHours);

export default router;

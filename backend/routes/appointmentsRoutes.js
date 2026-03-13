import { Router } from 'express';
import {
  availableSlots,
  createAppointment,
  deleteAppointment,
  listAppointments,
  updateAppointment
} from '../controllers/appointmentsController.js';

const router = Router();

router.get('/', listAppointments);
router.get('/available-slots', availableSlots);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;

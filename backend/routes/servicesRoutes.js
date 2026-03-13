import { Router } from 'express';
import { createService, deleteService, listServices, updateService } from '../controllers/servicesController.js';

const router = Router();

router.get('/', listServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;

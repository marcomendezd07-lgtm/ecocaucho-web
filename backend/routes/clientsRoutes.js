import { Router } from 'express';
import { clientHistory, createClient, deleteClient, listClients, updateClient } from '../controllers/clientsController.js';

const router = Router();

router.get('/', listClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.get('/:id/history', clientHistory);

export default router;

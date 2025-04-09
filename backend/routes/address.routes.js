import express from 'express';
import { updateAddress, getAddress } from '../controllers/address.controller.js';

const router = express.Router();

// Update address
router.put('/:id', updateAddress);

// Get address by ID
router.get('/:id', getAddress);

export default router;
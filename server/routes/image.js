'use strict';

import express from 'express';
import { getImage } from '../controllers/image';
const router = express.Router();

router.get('/:imgId', getImage);

export default router;
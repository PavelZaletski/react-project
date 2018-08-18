'use strict';

import express from 'express';
const router = express.Router();
import * as comment from '../controllers/comment';

router.post('/create', comment.create);

router.get('/:uniqueId', comment.get);

export default router;

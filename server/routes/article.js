'use strict';

import express from 'express';
const router = express.Router();
import * as article from '../controllers/article';

router.get('/', article.index);

router.get('/add', article.reactRenderAddArticle);

router.post('/create', article.create);

router.post('/update/:uniqueId', article.update);

router.get('/edit/:uniqueId', article.reactRenderEditArticle);

router.get('/:uniqueId', article.reactRenderShow);

router.get('/delete/:uniqueId', article.del);

export default router;

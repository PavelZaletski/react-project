'use strict';

import express from 'express';
import passport from 'passport';
import Account from '../models/account';
import * as indexCtr from '../controllers/index';
const router = express.Router();

router.post('/create-account',  indexCtr.createAccount);

router.get('/check', indexCtr.check);

router.post('/login', passport.authenticate('local'), indexCtr.login);

router.get('/logout', indexCtr.logout);

router.get('/', indexCtr.reactRender);
router.get('/login', indexCtr.reactRenderLogin);
router.get('/create-account', indexCtr.reactRenderCreateAccount);

export default router;
'use strict';

import exppressSession from 'express-session';

export default exppressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
});
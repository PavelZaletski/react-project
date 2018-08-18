'use strict';

import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db);
});

export function getImage(req, res) {
    gfs.exist({ filename: req.params.imgId }, function (err, found) {
        if (err) return handleError(err);
        if (found){
            var readStream = gfs.createReadStream({ filename: req.params.imgId });
            readStream.pipe(res);

        } else {
            res.status(404).send('not found');
        }
    });
}

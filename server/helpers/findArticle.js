import * as  Models from '../models';

export function findArticle(uniqueId) {
    return new Promise((resolve, reject) => {
        Models.Article.findOne({ uniqueId }, function (err, article) {
            if (err) {
                throw err;
            }

            if (article) {
                resolve(article);
            } else {
                reject();
            }
        });
    });
}

export function updateArticle(uniqueId, article) {
    return new Promise((resolve, reject) => {
        Models.Article.findOneAndUpdate({ uniqueId }, { $set: article }, { new: true }, function (err, updatedArticle) {
            resolve(updatedArticle);
        });
    });
}


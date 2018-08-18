import * as Models from '../models';

export default function (username){
	return new Promise((resolve) => {
		Models.Account.findOne({ username }, (err, account) => {
			if (err) {
				throw err;
			}

			if (account) {
				resolve(account);
			}
		});
	});
}
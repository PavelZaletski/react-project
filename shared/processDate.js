export default function(date) {
	if(!date){
		return '';
	}

	const currentDate = +(new Date());
	const publisheDate = +(new Date(date));
	const diff = (currentDate - publisheDate)/1000;
	let str;
	let value;
	const round = d => Math.round(d);
	const printDate = new dateCommand();
	if (diff < 3600){
		value = round(diff / 60);
		str = printDate.run('minute', value);
	} else if(diff < 3600 * 24){
		value = round(diff / 3600);
		str = printDate.run('hour', value);
	}  else if(diff < 3600 * 24 * 31){
		value = round(diff / (3600 * 24));
		str = printDate.run('day', value);
	} else {
		value = round(diff / (3600 * 24 * 30));
		str = printDate.run('month', value);
	}
	return str;
};

class dateCommand{
	minute(value){
		return  value + (value === 1 ? ' minute' : ' minutes') + ' ago';
	}
	hour(value){
		return value + (value === 1 ? ' hour' : ' hours') + ' ago';
	}
	day(value){
		return value + (value === 1 ? ' day' : ' days') + ' ago';
	}
	month(value){
		return value + (value === 1 ? ' month' : ' months') + ' ago';
	}
	run(method, value){
		return this[method] && this[method](value); 
	}
}

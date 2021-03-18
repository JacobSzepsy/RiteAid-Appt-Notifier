const fetch = require('node-fetch');
const sendEmail = require('./email.js');
const sleepTime = 30 * 1000;
const zipCode = '90210'; // must be string to maintain leading zeros
const searchRadius = '50'; // in miles
const terminalLink = require('terminal-link');

const link = terminalLink(
	'Rite Aid Appointment Website',
	'https://www.riteaid.com/pharmacy/apt-scheduler'
);

fetch(`https://www.riteaid.com/services/ext/v2/stores/getStores?address=${zipCode}&attrFilter=PREF-112&fetchMechanismVersion=2&radius=${searchRadius}`)
	.then((res) => res.json())
	.then((res) => {
		getAvailability(res.Data.stores);
	});

function getAvailability(stores) {
	const today = new Date();
	const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
	console.log(`\x1b[1mGrabbing availability\x1b[0m @ ${time}`);
	console.log(link);
	let promises = [];
	for (const store of stores) {
		promises.push(
			fetch(`https://www.riteaid.com/services/ext/v2/vaccine/checkSlots?storeNumber=${store.storeNumber}`)
			.then((res) => res.json())
		);
	}

	Promise.all(promises)
		.then((res) => {
			let available = [];

			res.map((res, index) => {
				const returnData = res.Data;
				const locationString = `${stores[index].address}, ${stores[index].city}`;
				if (returnData.slots['1'] || returnData.slots['2']) {
					if (!stores[index].apptFound) {
						const date = new Date();
						stores[index].apptFoundAt = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
						stores[index].apptFound = true;
						available.push(locationString);
					}
					console.log(`${locationString} - \x1b[32mAVAILABLE\x1b[0m @ ${stores[index].apptFoundAt}`);
				} else {
					stores[index].apptFound = false;
					console.log(`${locationString} - \x1b[31mNOT AVAILABLE\x1b[0m`);
				}
			});

			if (available.length > 0 && process.env.TARGET_EMAIL) {
				sendEmail(available);
			}
			return;
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			setTimeout(() => {
				getAvailability(stores);
			}, sleepTime);
		});
}
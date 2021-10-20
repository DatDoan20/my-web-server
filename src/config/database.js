const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
async function connect() {
	try {
		await mongoose.connect(DB, {}).then((connectInfo) => {
			console.log(`${'-'.repeat(55)}✨✨✨ DB connect Successfully!!✨✨✨`);
		});
	} catch (error) {
		console.log('connect failure ');
	}
}
module.exports = { connect };

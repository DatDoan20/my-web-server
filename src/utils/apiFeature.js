const Product = require('../app/models/Product');

class APIFeature {
	constructor(queryOutput, queryStringInput) {
		this.queryOutput = queryOutput;
		this.queryStringInput = queryStringInput;
	}
	filter() {
		const queryObjectInput = { ...this.queryStringInput };
		const excludedKey = ['page', 'sort', 'limit', 'fields'];
		excludedKey.forEach((element) => delete queryObjectInput[element]);

		//BUILD QUERY SEARCH NAME VALUE IS A PART OF STRING
		if (queryObjectInput.hasOwnProperty('name')) {
			queryObjectInput.name = {
				$regex: `${queryObjectInput.name}`,
				$options: 'i',
			};
		}
		if (
			queryObjectInput.hasOwnProperty('fromPrice') &&
			queryObjectInput.hasOwnProperty('toPrice')
		) {
			// queryObjectInput.price = {
			// 	$and: [
			// 		{ price: { gte: queryObjectInput.fromPrice } },
			// 		{ price: { lte: queryObjectInput.toPrice } },
			// 	],
			// };
			queryObjectInput.price = {
				gte: queryObjectInput.fromPrice,
				lte: queryObjectInput.toPrice,
			};

			delete queryObjectInput.fromPrice;
			delete queryObjectInput.toPrice;
		}

		//BUILD QUERY CONDITION
		let queryJsonInput = JSON.stringify(queryObjectInput);
		//g means that is will happen multiple times
		queryJsonInput = queryJsonInput.replace(/\b(gte|gt|lte|lt|ne)\b/g, (match) => `$${match}`);
		console.log(JSON.parse(queryJsonInput));
		//convert to object to find
		this.queryOutput = this.queryOutput.find(JSON.parse(queryJsonInput));
		return this;
	}
	sort() {
		if (this.queryStringInput.sort) {
			switch (this.queryStringInput.sort) {
				case 'price-asc':
					this.queryOutput = this.queryOutput.sort('-price');
					break;
				case 'price-desc':
					this.queryOutput = this.queryOutput.sort('price');
					break;
				case 'newest':
					this.queryOutput = this.queryOutput.sort('-createdAt'); // newest
					break;
				case 'top-sale':
					this.queryOutput = this.queryOutput.sort('-discount');
					break;
				default: //price:desc/asc
					this.queryOutput = this.queryOutput.sort('-price');
					break;
			}
		} else {
			//"-" is descending
			this.queryOutput = this.queryOutput.sort('-createdAt'); //newest
		}
		return this;
	}
	limitFields() {
		if (this.queryStringInput.fields) {
			const fields = this.queryStringInput.fields.split(',').join(' ');
			this.queryOutput = this.queryOutput.select(fields);
		} else {
			//get all fields exclude "__v"
			this.queryOutput = this.queryOutput.select('-__v');
		}
		return this;
	}
	pagination() {
		const page = this.queryStringInput.page * 1 || 1;
		const limit = this.queryStringInput.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.queryOutput = this.queryOutput.skip(skip).limit(limit);
		return this;
	}
}
module.exports = APIFeature;

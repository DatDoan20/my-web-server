const catchAsync = require('../handler/catchAsync');
const appError = require('../handler/appError');
const APIFeature = require('../../utils/apiFeature');
//
const returnResultOfRequest = (res, statusCode, data = undefined) => {
	const obj = { status: 'success' };
	if (data) {
		obj.results = data.length;
		obj.data = data;
	}
	res.status(statusCode).json({ ...obj });
};
// FACTORY FOR CRUD
//-------------------------------------------------DELETE
exports.softDeleteOneDocument = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.delete({ _id: req.params.id });
		if (!doc) {
			return next(new appError('No document found with that ID', 404));
		}
		returnResultOfRequest(res, 200);
	});
exports.forceDeleteOneDocument = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.deleteOne({ _id: req.params.id });
		if (!doc) {
			return next(new appError('No document found with that ID', 404));
		}
		returnResultOfRequest(res, 200);
	});

//-------------------------------------------------CREATE
exports.createOneDocument = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);
		returnResultOfRequest(res, 201, doc);
	});

//-------------------------------------------------UPDATE
exports.updateOneDocument = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
		if (!doc) {
			return next(new appError('No document found with that ID', 404));
		}
		returnResultOfRequest(res, 200, doc);
	});

//-------------------------------------------------GET
exports.getOneDocument = (Model, populateOption) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (populateOption) {
			query = query.populate(populateOption);
		}
		const doc = await query;
		if (!doc) {
			return next(new Error('No document found with that ID', 404));
		}
		returnResultOfRequest(res, 200, doc);
	});
// GET ALL
exports.getAllDocuments = (Model, populateOption) =>
	catchAsync(async (req, res, next) => {
		let query;
		//EXECUTE QUERY
		let apiFeature = new APIFeature(Model, req.query)
			.filter()
			.sort()
			.limitFields()
			.pagination();
		query = apiFeature.queryOutput;
		//check populate
		if (populateOption) {
			query = apiFeature.queryOutput.populate(populateOption);
		}
		const doc = await query;
		if (!query) {
			return next(new appError('No document found with that ID', 404));
		}
		returnResultOfRequest(res, 201, doc);
	});

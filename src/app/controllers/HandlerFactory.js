const catchAsync = require('../handler/catchAsync');
const appError = require('../handler/appError');
const APIFeature = require('../../utils/apiFeature');
const NotifyReview = require('../models/NotifyReview');
const NotifyComment = require('../models/NotifyComment');
const NotifyOrder = require('../models/NotifyOrder');
const Response = require('../../utils/response');

//
const returnResultOfRequest = (res, statusCode, data = undefined) => {
	return Response.simpleRequestResult(res, statusCode, data);
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
		returnResultOfRequest(res, 200, doc);
	});
//----------------------------------------------------RESTORE
exports.restoreOneDocument = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.restore({ _id: req.params.id });
		if (!doc) {
			return next(new appError('No document found with that ID', 404));
		}
		returnResultOfRequest(res, 200, doc);
	});

//-------------------------------------------------CREATE
// --- Emit Socket Review
const emitSocketNotifyReview = async (nameEventEmit, req, createdReview) => {
	//**THIS FUNCTION CREATE 'notifyReview' FOR 'createdReview' */
	// (1) create body notifyReview
	var bodyNewNotifyReview = {
		readState: false,
		reviewId: createdReview._id,
	};
	// sender is: user
	if (req.user.role === 'user') {
		//receiver is: admin
		bodyNewNotifyReview.receiverId = '60d8830a20ec084240e84ed7'; //admin id
	} else if (req.user.role === 'admin') {
		// admin can't review, this is test -> sender and receiver are admin
		bodyNewNotifyReview.receiverId = '60d8830a20ec084240e84ed7';
	}

	// (2) create new notifyReview
	var newNotifyReview = await NotifyReview.create(bodyNewNotifyReview);

	// (3) populate to get extra information
	newNotifyReview = await newNotifyReview.populate({ path: 'reviewId' });
	// .execPopulate();

	// (4) emit socket to admin
	if (req.app.socketIds[newNotifyReview.receiverId]) {
		req.app.io
			.to(req.app.socketIds[newNotifyReview.receiverId].socketId)
			.emit(`new${nameEventEmit}`, newNotifyReview);
	}
};
// --- Emit Socket Comment
const emitSocketNotifyComment = async (nameEventEmit, req, createdComment) => {
	//**THIS FUNCTION CREATE 'notifyComment' FOR 'createdComment' */

	// (1) 'createdComment' is comment for review 'A', FORM review 'A' GET all comments of review 'A'
	createdComment = await createdComment.populate({
		path: 'reviewId',
		select: '_id comments userId',
	});
	// .execPopulate();

	// (2) push 'userId' of 'who was review' into Array, so Array will contain 'userIdCommented' and 'userIdReviewed'
	createdComment.reviewId.comments.push({
		userId: createdComment.reviewId.userId,
	});
	// console.log(createdComment.reviewId.comments);

	// (3) GET comments in array 'comments'
	var checks = new Set();
	var receiverIds = [];
	var idOfUserCommentedOrReviewed;

	// Loop to get userId of all comments
	createdComment.reviewId.comments.forEach((comment) => {
		idOfUserCommentedOrReviewed = comment.userId._id.toString();
		if (!checks.has(idOfUserCommentedOrReviewed)) {
			if (idOfUserCommentedOrReviewed !== req.user._id.toString()) {
				receiverIds.push({ receiverId: idOfUserCommentedOrReviewed, readState: false });
				checks.add(idOfUserCommentedOrReviewed);
			}
		}
	});
	// console.log(receiverIds);

	//add receiver is admin to admin receive this comment
	// receiverIds.push({ receiverId: '60d8830a20ec084240e84ed7', readState: false });

	// (4) Ok, create notifyComment
	var bodyNewNotifyComment = { commentId: createdComment._id, receiverIds: receiverIds };
	var newNotifyComment = await NotifyComment.create(bodyNewNotifyComment);

	// (5) populate notifyComment to get extra info
	newNotifyComment = await newNotifyComment.populate({ path: 'commentId' });
	// .execPopulate();

	//(6) emit socket notifyComment to user in receiverIds
	// console.log(newNotifyComment);
	// Loop receiverIds
	newNotifyComment.receiverIds.forEach((receiverItem) => {
		//receiver have to connecting with server(Online)
		if (req.app.socketIds[receiverItem.receiverId]) {
			// console.log(req.app.socketIds[receiverItem.receiverId]);
			req.app.io
				.to(req.app.socketIds[receiverItem.receiverId].socketId)
				.emit(`new${nameEventEmit}`, newNotifyComment);
		}
	});
};
// --- Emit Socket Order
const emitSocketNotifyOrder = async (nameEventEmit, req, createdOrder) => {
	//**THIS FUNCTION CREATE 'notifyOrder' FOR 'createdOrder' */
	// (1) array receiverIds
	var receiverIds = [];
	var receiverItem = { receiverId: '60d8830a20ec084240e84ed7', readState: false };
	receiverIds.push(receiverItem);

	// (2) body notify order, receiver is admin, not need filed state and totalPayment
	var newBodyNotifyOrder = {
		orderId: createdOrder._id,
		receiverIds: receiverIds,
	};

	// (3) create
	var newNotifyOrder = await NotifyOrder.create(newBodyNotifyOrder);
	newNotifyOrder = await newNotifyOrder.populate({
		path: 'orderId',
		populate: { path: 'userId' },
	});
	// .execPopulate();

	// (4) check if admin is online? to emit
	var adminId = newNotifyOrder.receiverIds[0].receiverId;
	if (req.app.socketIds[adminId]) {
		req.app.io
			.to(req.app.socketIds[adminId].socketId)
			.emit(`new${nameEventEmit}`, newNotifyOrder);
	}
};
// ---- Create
exports.createOneDocument = (Model, nameEventEmit = undefined) =>
	catchAsync(async (req, res, next) => {
		var doc = await Model.create(req.body);
		if (nameEventEmit === 'Order') {
			await emitSocketNotifyOrder(nameEventEmit, req, doc);
			var docCustom = {
				addressDelivery: doc.addressDelivery,
				totalPayment: doc.totalPayment,
			};
			returnResultOfRequest(res, 201, docCustom);
		} else if (nameEventEmit === 'Review') {
			await emitSocketNotifyReview(nameEventEmit, req, doc);
			returnResultOfRequest(res, 201);
		} else if (nameEventEmit === 'Comment') {
			await emitSocketNotifyComment(nameEventEmit, req, doc);
			returnResultOfRequest(res, 201);
		} else {
			returnResultOfRequest(res, 201, doc);
		}
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
		console.log(req.query);
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

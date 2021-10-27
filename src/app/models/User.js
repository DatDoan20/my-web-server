const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//
const User = new Schema(
	{
		phone: { type: String, unique: true, required: true },
		email: { type: String, unique: true, lowercase: true, required: true },
		stateVerifyEmail: { type: Boolean, default: false },
		name: { type: String, maxLength: 50, required: true },
		password: { type: String, minLength: 8, required: true },
		avatar: { type: String, default: 'default.png' },
		passwordChangedAt: { type: Date },
		role: { type: String, enum: ['user', 'admin'], default: 'user' },
		passwordResetToken: { type: String },
		passwordResetExpires: { type: Date },
		sex: { type: String, enum: ['male', 'female'], default: 'female' },
		birthYear: { type: String, default: '0000' },
		readAllOrderNoti: { type: Date, default: new Date() },
		readAllCommentNoti: { type: Date, default: new Date() },
		cart: [
			new Schema(
				{
					infoProduct: { type: mongoose.Schema.ObjectId, ref: 'Product' },
					quantity: { type: Number, required: true },
					price: { type: Number },
					size: { type: String, required: true },
					color: { type: String, required: true },
				},
				{
					_id: false,
					toJSON: { virtuals: true },
					toObject: { virtuals: true },
				}
			),
		],

		favProducts: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Product',
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);
User.plugin(mongooseDelete, { overrideMethods: true });
User.plugin(mongooseDelete, { deletedAt: true });

//middleware
User.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	next();
});
User.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now();
	next();
});
// User.pre(/^find/, function(next) {
//     this.populate({
// 		path:'cart.infoProduct',
// 		select: '-__v -deleted -createdAt -updatedAt -slug -size -color'
// 	})
//     next()
// })
//check password encode
User.methods.isCorrectPassword = async function (inputPassword, userPassword) {
	return await bcrypt.compare(inputPassword, userPassword);
};

//check token is valid when password was changed
User.methods.changedPasswordAt = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		// valid is: JWTTimestamp have to greater than changedTimestamp
		return JWTTimestamp < changedTimestamp;
	}
	//if passwordChangedAt is null that means user never change password
	return false;
};

//random byte with crypto
User.methods.createPasswordResetToken = function () {
	//create resetToken
	const resetToken = crypto.randomBytes(32).toString('hex');

	//encrypt the resetToken and save it into database
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	//10 minutes, * this line is assign value but not really update document-> need to save it
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

//lowercase_abc_abc -> self understand in database
module.exports = mongoose.model('User', User);

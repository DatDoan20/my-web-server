const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
	constructor(user, url, nameKey, data) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = process.env.EMAIL_FROM;
		this.data = data;
		this.nameKey = nameKey;
	}
	createNewTransport() {
		if (process.env.NODE_ENV === 'production') {
			return nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.EMAIL_USERNAME_PRO,
					pass: process.env.EMAIL_PASSWORD_PRO,
				},
			});
		} else {
			//mail trap
			return nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				auth: {
					user: process.env.EMAIL_USERNAME_DEV,
					pass: process.env.EMAIL_PASSWORD_DEV,
				},
			});
		}
	}

	//Send the actual email
	async send(templateLink, subject) {
		// 1) render HTML based on pug template
		const html = pug.renderFile(`${__dirname}/../resources/views/${templateLink}`, {
			firstName: this.firstName,
			url: this.url,
			[this.nameKey]: this.data,
		});

		// 2) define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: subject,
			html: html,
			text: convert(html, { wordwrap: 130 }),
		};

		// 3) create transport and send email
		await this.createNewTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('email/welcome.pug', 'Welcome to the clothes shop! ❤');
	}
	async sendPasswordReset() {
		await this.send(
			'email/passwordReset.pug',
			'Your password reset token (valid for only 10 minutes ⏳)'
		);
	}
	async sendInfoOrder(actionType) {
		var msg;
		if (actionType === 'accept') {
			msg =
				'Cảm ơn bạn đã đặt hàng, đây là đơn hàng của bạn, bạn có thể vào tài khoản cả nhân để kiểm tra đơn hàng này';
		} else if (actionType === 'cancel') {
			msg = 'Đơn hàng của bạn đã bị hủy, đây là thông tin đơn hàng đã hủy của bạn!';
		}
		await this.send('order/orderDetail.pug', msg);
		return true;
	}
};

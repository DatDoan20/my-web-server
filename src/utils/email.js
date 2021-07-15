const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Admin Clothes Shop <${process.env.EMAIL_FROM}>`;
	}
	createNewTransport() {
		if (process.env.NODE_ENV === 'production') {
			//sendgrid (lib use real email)
			return 1;
		} else {
			// 1. create a transporter
			return nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
			});
		}
	}

	//Send the actual email
	async send(template, subject) {
		// 1) render HTML based on pug template
		const html = pug.renderFile(`${__dirname}/../resources/views/email/${template}.pug`,{
			firstName = this.firstName,
			url = this.url,
			subject = this.subject
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
		await this.createNewTransport().sendMail(mailOptions)
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the clothes shop! ❤');
	}
};

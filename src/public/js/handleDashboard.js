import {
	catchAsyncAction,
	showAlertRequest,
	showAlertFail,
	showAlertWaiting,
} from './handlerActionGeneric.js';
import { handleReply } from './handlerReviewComment.js';
import { addHTMLReviewAndCommentElement, addHTMLOrderElement } from './dynamicCodeHTML.js';

// ----------------------------- EVENT
// Hide red dot (notify unread)
$('#icon-notify-generic').hide();

// Set css for tag a
$('.link').hover(
	function () {
		$(this).css('text-decoration', 'underline');
	},
	function () {
		$(this).css('text-decoration', 'none');
	}
);

// Logout event in dashboard
$('#MyBtnLogout').click(async function () {
	catchAsyncAction(async function () {
		const res = await axios({
			method: 'GET',
			url: '/api/users/sign-out',
		});
		if (res.data.status === 'success') {
			location.assign('/admin/sign-in');
		}
	});
});

// Show,hide menu in dashboard
$('#btn-click-hide-show-menu-d-shop').prop('checked', true);
$('#btn-click-hide-show-menu-d-shop').change(function () {
	if (this.checked) {
		$('#img-click-hide-show-menu-d-shop').text('✖️');
		$('.menu-d-shop').show();
	} else {
		$('#img-click-hide-show-menu-d-shop').text('➕');
		$('.menu-d-shop').hide();
	}
});

//------------------------- LOAD NOTIFY
function loadCountNotifyUnRead(elementShowNumber, numberNotifyUnRead) {
	$(elementShowNumber).text(`${numberNotifyUnRead}`);
	if (numberNotifyUnRead > 0) {
		$(elementShowNumber).show();
		$('#icon-notify-generic').show();
	} else {
		$(elementShowNumber).hide();
		$('#icon-notify-generic').hide();
	}
}

function updateCountWhenReceiveNotify(elementShowNumber) {
	var numberUnRead = $(elementShowNumber).text();
	numberUnRead = parseInt(numberUnRead) + 1;

	$(elementShowNumber).text(numberUnRead);
	$(elementShowNumber).show();
	$('#icon-notify-generic').show();
}

function updateCountWhenClickReplyNotify(element, notifyId, elementShowNumber) {
	//update css
	var subElement = element.children('.sub-box').children(`.notify-id-${notifyId}`);
	subElement.css('opacity', '0.3');
	element.attr('data-read-state', true);

	//update count
	var numberNotifyUnRead = $(elementShowNumber).text();
	numberNotifyUnRead = parseInt(numberNotifyUnRead);
	if (numberNotifyUnRead > 0) {
		numberNotifyUnRead--;
		loadCountNotifyUnRead(elementShowNumber, numberNotifyUnRead);
	}
}
// Load notify review - OK
$('#block-notify-review').ready(function () {
	catchAsyncAction(async function () {
		const notifyReviewsList = await axios({
			method: 'GET',
			url: '/api/users/notify-reviews/search?page=1&limit=10',
		});
		var numberReviewUnRead = 0;
		if (notifyReviewsList.data.status === 'success' && notifyReviewsList.data.data.length > 0) {
			for (var i = notifyReviewsList.data.data.length - 1; i >= 0; i--) {
				var notifyReview = notifyReviewsList.data.data[i];
				addHTMLReviewAndCommentElement(
					'#block-notify-review',
					notifyReview.reviewId._id,
					notifyReview._id,
					notifyReview.reviewId.userId.avatar,
					`${notifyReview.reviewId.userId.name} - ${notifyReview.reviewId.rating}⭐`,
					notifyReview.reviewId.review,
					new Date(notifyReview.updatedAt).toLocaleString('vi-vn'),
					notifyReview.readState
				);
				if (notifyReview.readState === false) {
					numberReviewUnRead++;
				}
			}
		}
		loadCountNotifyUnRead('#number-notify-review-unread', numberReviewUnRead);
		console.log('Load notify reviews success!');
	});
});

// Load comment - OK
$('#block-notify-comment').ready(function () {
	catchAsyncAction(async function () {
		const notifyCommentsList = await axios({
			method: 'GET',
			url: '/api/users/notify-comments/me',
		});
		var numberCommentUnRead = 0;
		if (
			notifyCommentsList.data.status === 'success' &&
			notifyCommentsList.data.data.length > 0
		) {
			for (var i = notifyCommentsList.data.data.length - 1; i >= 0; i--) {
				var notifyComment = notifyCommentsList.data.data[i];
				addHTMLReviewAndCommentElement(
					'#block-notify-comment',
					notifyComment.commentId.reviewId,
					notifyComment._id,
					notifyComment.commentId.userId.avatar,
					notifyComment.commentId.userId.name,
					notifyComment.commentId.comment,
					new Date(notifyComment.updatedAt).toLocaleString('vi-vn'),
					notifyComment.receiverIds[0].readState
				);
				if (notifyComment.receiverIds[0].readState === false) {
					numberCommentUnRead++;
				}
			}
		}
		loadCountNotifyUnRead('#number-notify-comment-unread', numberCommentUnRead);
		console.log('Load notify comments success!');
	});
});

// Load order - OK
$('#block-notify-order').ready(function () {
	catchAsyncAction(async function () {
		const notifyOrdersList = await axios({
			method: 'GET',
			url: '/api/users/notify-orders/me',
		});
		var numberOrderUnRead = 0;
		if (notifyOrdersList.data.status === 'success' && notifyOrdersList.data.data.length > 0) {
			for (var i = notifyOrdersList.data.data.length - 1; i >= 0; i--) {
				var notifyOrder = notifyOrdersList.data.data[i];
				addHTMLOrderElement(
					'#block-notify-order',
					notifyOrder.orderId._id,
					notifyOrder._id,
					notifyOrder.orderId.userId.avatar,
					notifyOrder.orderId.userId.name,
					notifyOrder.orderId.state,
					notifyOrder.orderId.purchasedProducts.length,
					(notifyOrder.orderId.totalPayment / 1000).toFixed(3),
					notifyOrder.orderId.paymentMode,
					notifyOrder.orderId.nameUser,
					notifyOrder.orderId.addressDelivery,
					notifyOrder.orderId.emailUser,
					notifyOrder.orderId.phoneUser,
					new Date(notifyOrder.updatedAt).toLocaleString('vi-vn'),
					notifyOrder.receiverIds[0].readState
				);
				if (notifyOrder.receiverIds[0].readState === false) {
					numberOrderUnRead++;
				}
			}
		}
		loadCountNotifyUnRead('#number-notify-order-unread', numberOrderUnRead);
		console.log('Load notify orders success!');
	});
});

// ----------------------- SOCKET SHOW NEW NOTIFY WHEN SERVER EMIT
// Connect
const socket = io();
// Verify
var userId = $('#img-avatar-admin').data('id');
socket.emit('ConnectLogin', userId);

// Listen new notify review - OK
socket.on('newReview', (newNotifyReview) => {
	addHTMLReviewAndCommentElement(
		'#block-notify-review',
		newNotifyReview.reviewId._id,
		newNotifyReview._id,
		newNotifyReview.reviewId.userId.avatar,
		`${newNotifyReview.reviewId.userId.name} - ${newNotifyReview.reviewId.rating}⭐`,
		newNotifyReview.reviewId.review,
		new Date(newNotifyReview.updatedAt).toLocaleString('vi-vn'),
		newNotifyReview.readState
	);
	updateCountWhenReceiveNotify('#number-notify-review-unread');
});

// Listen new notify comment - OK
socket.on('newComment', (newNotifyComment) => {
	// console.log(newNotifyComment);
	addHTMLReviewAndCommentElement(
		'#block-notify-comment',
		newNotifyComment.commentId.reviewId,
		newNotifyComment._id,
		newNotifyComment.commentId.userId.avatar,
		newNotifyComment.commentId.userId.name,
		newNotifyComment.commentId.comment,
		new Date(newNotifyComment.updatedAt).toLocaleString('vi-vn'),
		newNotifyComment.receiverIds[0].readState
	);
	updateCountWhenReceiveNotify('#number-notify-comment-unread');
});

// Listen new order - OK
socket.on('newOrder', (newNotifyOrder) => {
	addHTMLOrderElement(
		'#block-notify-order',
		newNotifyOrder.orderId._id,
		newNotifyOrder._id,
		newNotifyOrder.orderId.userId.avatar,
		newNotifyOrder.orderId.userId.name,
		newNotifyOrder.orderId.state,
		newNotifyOrder.orderId.purchasedProducts.length,
		(newNotifyOrder.orderId.totalPayment / 1000).toFixed(3),
		newNotifyOrder.orderId.paymentMode,
		newNotifyOrder.orderId.nameUser,
		newNotifyOrder.orderId.addressDelivery,
		newNotifyOrder.orderId.emailUser,
		newNotifyOrder.orderId.phoneUser,
		new Date(newNotifyOrder.updatedAt).toLocaleString('vi-vn'),
		newNotifyOrder.receiverIds[0].readState
	);
	updateCountWhenReceiveNotify('#number-notify-order-unread');
});

// ------------------- SET EVENT NOTIFY AFTER LOADED
// Event click notify review
$('#block-notify-review').on('click', '.box-notify-review-and-comment', async function (e) {
	await handleReplyReviewOrComment(e, $(this), 'Review');
});
// Event click notify comment
$('#block-notify-comment').on('click', '.box-notify-review-and-comment', async function (e) {
	await handleReplyReviewOrComment(e, $(this), 'Comment');
});
// Event click notify order
$('#block-notify-order').on('click', '.box-notify-order', async function (e) {
	if ($(this).data('read-state') === false) {
		await updateStateNotifyOrder($(this));
	}
});

// element can be reviewNotify or reviewComment HTML
async function handleReplyReviewOrComment(e, element, notifyClicked) {
	e.preventDefault();

	const name = element.data('name');
	const content = element.data('content');
	const textReply = await showAlertRequest(`${name}: ${content}`);
	if (textReply) {
		const alertWaiting = showAlertWaiting('Comment is being sent');
		// * reply comment or reply review -> use generic idReview
		var result = await handleReply(textReply, element.data('review-id'), false);
		// * true: success
		if (result === true) {
			alertWaiting.close();
			if (notifyClicked === 'Review' && element.data('read-state') === false) {
				await updateStateNotifyReview(element);
			} else if (notifyClicked === 'Comment' && element.data('read-state') === false) {
				await updateStateNotifyComment(element);
			}
		}
	} else {
		showAlertFail('Cancel', 'Your comment is empty! or you was cancel');
	}
}

async function updateStateNotifyReview(element) {
	//update current review notify  true
	catchAsyncAction(async function () {
		const notifyReviewId = element.data('notify-id');

		const alertWaiting = showAlertWaiting('Updating..');
		const result = await axios({
			method: 'PATCH',
			url: `/api/users/notify-reviews/${notifyReviewId}`,
		});
		alertWaiting.close();

		if (result.data.status === 'success') {
			console.log('update state notification');
			updateCountWhenClickReplyNotify(
				element,
				notifyReviewId,
				'#number-notify-review-unread'
			);
		}
	});
}

async function updateStateNotifyComment(element) {
	//update current comment notify  true
	catchAsyncAction(async function () {
		const notifyCommentId = element.data('notify-id');

		const alertWaiting = showAlertWaiting('Updating..');
		const result = await axios({
			method: 'PATCH',
			url: `/api/users/notify-comments/${notifyCommentId}/read/me`,
		});
		alertWaiting.close();

		if (result.data.status === 'success') {
			console.log('check notify comment read success');
			updateCountWhenClickReplyNotify(
				element,
				notifyCommentId,
				'#number-notify-comment-unread'
			);
		}
	});
}

async function updateStateNotifyOrder(elementOrder) {
	catchAsyncAction(async function () {
		const notifyOrderId = elementOrder.data('notify-id');
		const result = await axios({
			method: 'PATCH',
			url: `/api/users/notify-orders/${notifyOrderId}`,
		});
		if (result.data.status === 'success') {
			console.log('check notify order read success');
			updateCountWhenClickReplyNotify(
				elementOrder,
				notifyOrderId,
				'#number-notify-order-unread'
			);
		}
	});
}

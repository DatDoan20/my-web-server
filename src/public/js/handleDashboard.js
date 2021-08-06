import {
	catchAsyncAction,
	showAlertRequest,
	showAlertFail,
	showAlertWaiting,
	showAlertSuccess,
} from './handlerActionGeneric.js';
import { handleReply } from './handlerReviewComment.js';

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
function addHTMLReviewAndCommentElement(
	idElement,
	reviewId,
	notifyId,
	avatar,
	name,
	content,
	time,
	readState
) {
	var opacityValue = 1.0;
	if (readState === true) {
		opacityValue = 0.3;
	}
	var strAttribute = `data-content="${content}" data-name="${name}" data-notify-id="${notifyId}" data-read-state="${readState}"`;
	$(idElement).prepend(`
		<a class="box-notify-review-and-comment block" href="#" target="_blank" data-review-id="${reviewId}" ${strAttribute}>
			<div class="flex px-4 space-x-4 sub-box">
				<div class="relative flex-shrink-0">
					<span class="relative z-10 inline-block overflow-visible rounded-ful">
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${avatar}" alt="avatar" /></span>
					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
				</div>
				<div class="flex-1 overflow-hidden notify-id-${notifyId}" style='opacity:${opacityValue};'>
					<h5 class="text-sm font-semibold text-gray-600 dark:text-light">${name}</h5>
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">${content}</p>
					<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${time}</span>
				</div>
			</div>
		</a>
	`);
}
function addHTMLOrderElement(
	idElement,
	orderId,
	notifyId,
	avatar,
	name,
	state,
	numberOfProducts,
	totalPayment,
	paymentMode,
	receiverName,
	addressDelivery,
	receiverEmail,
	receiverPhone,
	time,
	readState
) {
	var colorState;
	if (state === 'waiting') {
		colorState = '#d6c90f';
	} else if (state === 'accepted') {
		colorState = '#0faf14';
	} else if (state === 'canceled') {
		colorState = '#d50505';
	}
	var opacityValue = 1.0;
	if (readState === true) {
		opacityValue = 0.3;
	}
	$(idElement).prepend(`
		<a class="box-notify-order block" href="/admin/orders/${orderId}" target="_blank" data-notify-id="${notifyId}" data-read-state="${readState}">
			<div class="flex px-4 space-x-4 sub-box">
				<div class="relative flex-shrink-0">
					<span class="relative z-10 inline-block overflow-visible rounded-ful">
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${avatar}" alt="avatar" /></span>
					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
				</div>
				<div class="flex-1 overflow-hidden notify-id-${notifyId}" style='opacity:${opacityValue};'>
					<h5 class="text-sm font-semibold text-gray-600 dark:text-light" style="margin-top:5px; margin-bottom:5px;">${name}
						<span style='font-weight: bold; color:#fff; background-color:${colorState}; padding-left:3px; padding-right:3px;
						border-radius:8px;'>${state}</span>
					</h5>
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Số lượng sản phẩm: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${numberOfProducts}</span>
					</p>

					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Tổng giá đơn hàng: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${totalPayment}đ</span>
					</p>

					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Phương thức thanh toán: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${paymentMode}</span>
					</p>

					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Người nhận: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${receiverName}</span>
					</p>
					
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Địa chỉ: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${addressDelivery}</span>
					</p>
					
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Email: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${receiverEmail}</span>
					</p>
					
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Số điện thoại:
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${receiverPhone}</span>
					</p>
					
					<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${time}</span>
				</div>
			</div>
		</a>
	`);
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
		$('#number-notify-review-unread').text(`${numberReviewUnRead}`);
		if (numberReviewUnRead > 0) {
			$('#number-notify-review-unread').show();
			$('#icon-notify-generic').show();
		} else {
			$('#number-notify-review-unread').hide();
			$('#icon-notify-generic').hide();
		}
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
		$('#number-notify-comment-unread').text(`${numberCommentUnRead}`);
		if (numberCommentUnRead > 0) {
			$('#number-notify-comment-unread').show();
			$('#icon-notify-generic').show();
		} else {
			$('#number-notify-comment-unread').hide();
			$('#icon-notify-generic').hide();
		}
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
		$('#number-notify-order-unread').text(`${numberOrderUnRead}`);
		if (numberOrderUnRead > 0) {
			$('#number-notify-order-unread').show();
			$('#icon-notify-generic').show();
		} else {
			$('#number-notify-order-unread').hide();
			$('#icon-notify-generic').hide();
		}
		console.log('Load notify orders success!');
	});
});

// ----------------------- SOCKET SHOW NEW NOTIFY WHEN SERVER EMIT
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
	var numberUnRead = $('#number-notify-review-unread').text();
	numberUnRead = parseInt(numberUnRead) + 1;

	$('#number-notify-review-unread').text(numberUnRead);
	$('#number-notify-review-unread').show();
	$('#icon-notify-generic').show();
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
	var numberUnRead = $('#number-notify-comment-unread').text();
	numberUnRead = parseInt(numberUnRead) + 1;
	$('#number-notify-comment-unread').text(numberUnRead);
	$('#number-notify-comment-unread').show();
	$('#icon-notify-generic').show();
});

// Listen new order
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
});

// --------------- SET EVENT NOTIFY AFTER LOADED
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
		await handleCheckOrderNotify($(this));
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
		// reply comment or reply review -> use generic idReview
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
	console.log('update state notification');
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
			console.log('check notify review read success');
			var elementReadReview = element
				.children('.sub-box')
				.children(`.notify-id-${notifyReviewId}`);
			elementReadReview.css('opacity', '0.3');
			element.attr('data-read-state', true);

			var numberUnRead = $('#number-notify-review-unread').text();
			numberUnRead = parseInt(numberUnRead);
			if (numberUnRead > 0) {
				numberUnRead--;
				$('#number-notify-review-unread').text(numberUnRead);
				if (numberUnRead > 0) {
					$('#number-notify-review-unread').show();
				} else {
					$('#number-notify-review-unread').hide();
				}
			}
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
			url: `/api/users/notify-comments/${notifyCommentId}`,
		});
		alertWaiting.close();

		if (result.data.status === 'success') {
			console.log('check notify comment read success');
			var elementReadComment = element
				.children('.sub-box')
				.children(`.notify-id-${notifyCommentId}`);
			elementReadComment.css('opacity', '0.3');
			element.attr('data-read-state', true);

			var numberUnRead = $('#number-notify-comment-unread').text();
			numberUnRead = parseInt(numberUnRead);
			if (numberUnRead > 0) {
				numberUnRead--;
				$('#number-notify-comment-unread').text(numberUnRead);
				if (numberUnRead > 0) {
					$('#number-notify-comment-unread').show();
				} else {
					$('#number-notify-comment-unread').hide();
				}
			}
		}
	});
}

async function handleCheckOrderNotify(elementOrder) {
	catchAsyncAction(async function () {
		const notifyOrderId = elementOrder.data('notify-id');
		const result = await axios({
			method: 'PATCH',
			url: `/api/users/notify-orders/${notifyOrderId}`,
		});
		if (result.data.status === 'success') {
			console.log('check notify order read success');
			var elementReadOrder = elementOrder
				.children('.sub-box')
				.children(`.notify-id-${notifyOrderId}`);
			elementReadOrder.css('opacity', '0.3');
			elementOrder.attr('data-read-state', true);
		}
	});
}

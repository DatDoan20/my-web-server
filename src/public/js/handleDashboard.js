import { catchAsyncAction } from './handlerActionGeneric.js';
//hide red dot (notify unread)
$('#icon-notify-generic').hide();
//set css for tag a
$('.link').hover(
	function () {
		$(this).css('text-decoration', 'underline');
	},
	function () {
		$(this).css('text-decoration', 'none');
	}
);
//logout event in dashboard
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
//show,hide menu in dashboard
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
//-----------------------------
function addHTMLReviewAndCommentElement(idElement, avatar, name, content, time, readState) {
	var opacityValue = 1.0;
	if (readState === true) {
		opacityValue = 0.3;
	}
	$(idElement).prepend(`
		<a class="box-notify-review-and-comment block" href="" target="_blank">
			<div class="flex px-4 space-x-4">
				<div class="relative flex-shrink-0">
					<span class="relative z-10 inline-block overflow-visible rounded-ful">
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${avatar}" alt="avatar" /></span>
					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
				</div>
				<div class="flex-1 overflow-hidden" style='opacity:${opacityValue};'>
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
		<a class="box-notify-review-and-comment block" href="/admin/orders/${orderId}" target="_blank">
			<div class="flex px-4 space-x-4">
				<div class="relative flex-shrink-0">
					<span class="relative z-10 inline-block overflow-visible rounded-ful">
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${avatar}" alt="avatar" /></span>
					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
				</div>
				<div class="flex-1 overflow-hidden" style='opacity:${opacityValue};'>
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
//load notify review - OK
$('#block-notify-review').ready(function () {
	catchAsyncAction(async function () {
		const notifyReviewsList = await axios({
			method: 'GET',
			url: '/api/users/notify-reviews/search?page=1&limit=10',
		});
		if (notifyReviewsList.data.status === 'success' && notifyReviewsList.data.data.length > 0) {
			var numberReviewUnRead = 0;
			for (var i = notifyReviewsList.data.data.length - 1; i >= 0; i--) {
				var notifyReview = notifyReviewsList.data.data[i];
				addHTMLReviewAndCommentElement(
					'#block-notify-review',
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
			if (numberReviewUnRead > 0) {
				$('#number-notify-review-unread').text(`${numberReviewUnRead}`);
				$('#number-notify-review-unread').show();
				$('#icon-notify-generic').show();
			}
			console.log('Load notify reviews success!');
		}
	});
});
//load comment - OK
$('#block-notify-comment').ready(function () {
	catchAsyncAction(async function () {
		const notifyCommentsList = await axios({
			method: 'GET',
			url: '/api/users/notify-comments/me',
		});
		if (
			notifyCommentsList.data.status === 'success' &&
			notifyCommentsList.data.data.length > 0
		) {
			var numberCommentUnRead = 0;
			for (var i = notifyCommentsList.data.data.length - 1; i >= 0; i--) {
				var notifyComment = notifyCommentsList.data.data[i];
				addHTMLReviewAndCommentElement(
					'#block-notify-comment',
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
			if (numberCommentUnRead > 0) {
				$('#number-notify-comment-unread').text(`${numberCommentUnRead}`);
				$('#number-notify-comment-unread').show();
				$('#icon-notify-generic').show();
			}
			console.log('Load notify comments success!');
		}
	});
});
//load order
$('#block-notify-order').ready(function () {
	catchAsyncAction(async function () {
		const notifyOrdersList = await axios({
			method: 'GET',
			url: '/api/users/notify-orders/me',
		});
		if (notifyOrdersList.data.status === 'success' && notifyOrdersList.data.data.length > 0) {
			var numberOrderUnRead = 0;
			for (var i = notifyOrdersList.data.data.length - 1; i >= 0; i--) {
				var notifyOrder = notifyOrdersList.data.data[i];
				addHTMLOrderElement(
					'#block-notify-order',
					notifyOrder.orderId._id,
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
			if (numberOrderUnRead > 0) {
				$('#number-notify-order-unread').text(`${numberOrderUnRead}`);
				$('#number-notify-order-unread').show();
				$('#icon-notify-generic').show();
			}
			console.log('Load notify orders success!');
		}
	});
});

// SOCKET SHOW NEW NOTIFY
const socket = io();
// Verify
var userId = $('#img-avatar-admin').data('id');

socket.emit('ConnectLogin', userId);

// Listen new notify review - OK
socket.on('newReview', (newNotifyReview) => {
	addHTMLReviewAndCommentElement(
		'#block-notify-review',
		newNotifyReview.reviewId.userId.avatar,
		`${newNotifyReview.reviewId.userId.name} - ${newNotifyReview.reviewId.rating}⭐`,
		newNotifyReview.reviewId.review,
		new Date(newNotifyReview.updatedAt).toLocaleString('vi-vn'),
		newNotifyReview.readState
	);
});

// Listen new notify comment - OK
socket.on('newComment', (newNotifyComment) => {
	// console.log(newNotifyComment);
	addHTMLReviewAndCommentElement(
		'#block-notify-comment',
		newNotifyComment.commentId.userId.avatar,
		newNotifyComment.commentId.userId.name,
		newNotifyComment.commentId.comment,
		new Date(newNotifyComment.updatedAt).toLocaleString('vi-vn'),
		newNotifyComment.receiverIds[0].readState
	);
});

//Listen new order
socket.on('newOrder', (newNotifyOrder) => {
	addHTMLOrderElement(
		'#block-notify-order',
		newNotifyOrder.orderId._id,
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

import { catchAsyncAction } from './handlerActionGeneric.js';
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

function addHTMLtoElement(idElement, avatar, title, content, time) {
	$(idElement).prepend(`
		<a class="box-notify-review-and-comment block" href="#" target="_blank">
			<div class="flex px-4 space-x-4">
				<div class="relative flex-shrink-0">
					<span class="relative z-10 inline-block overflow-visible rounded-ful">
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${avatar}" alt="avatar" /></span>
					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
				</div>
				<div class="flex-1 overflow-hidden">
					<h5 class="text-sm font-semibold text-gray-600 dark:text-light">${title}</h5>
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">${content}</p>
					<span class="text-sm font-normal text-gray-400 dark:text-primary-light">${time}</span>
				</div>
			</div>
		</a>
	`);
}
//load review
$('#block-notify-review').ready(function () {
	catchAsyncAction(async function () {
		const res = await axios({
			method: 'GET',
			url: '/api/users/reviews/search?page=1&limit=10',
		});
		if (res.data.status === 'success') {
			for (var i = res.data.data.length - 1; i >= 0; i--) {
				var review = res.data.data[i];
				addHTMLtoElement(
					'#block-notify-review',
					review.userId.avatar,
					`${review.userId.name} - ${review.rating}⭐`,
					review.review,
					new Date(review.updatedAt).toLocaleString('vi-vn')
				);
			}
			console.log('Load notify reviews success!');
		}
	});
});
//load comment
$('#block-notify-comment').ready(function () {
	catchAsyncAction(async function () {
		const res = await axios({
			method: 'GET',
			url: '/api/users/reviews/comments/search?page=1&limit=10',
		});
		if (res.data.status === 'success') {
			for (var i = res.data.data.length - 1; i >= 0; i--) {
				var comment = res.data.data[i];
				addHTMLtoElement(
					'#block-notify-comment',
					comment.userId.avatar,
					`${comment.userId.name}`,
					comment.comment,
					new Date(comment.updatedAt).toLocaleString('vi-vn')
				);
			}
			console.log('Load notify comments success!');
		}
	});
});
// SOCKET SHOW NOTIFY
const socket = io();
//verify
socket.emit('AdminId', 'I am admin');
//listen new review
socket.on('newReview', (review, timeString) => {
	addHTMLtoElement(
		'#block-notify-review',
		review.userId.avatar,
		`${review.userId.name} - ${review.rating}⭐`,
		review.review,
		new Date(review.updatedAt).toLocaleString('vi-vn')
	);
});
//listen new order
socket.on('newOrder', (order, timeString) => {});
//listen new comment
socket.on('newComment', (order, timeString) => {
	addHTMLtoElement(
		'#block-notify-comment',
		comment.userId.avatar,
		`${comment.userId.name}`,
		comment.comment,
		new Date(comment.updatedAt).toLocaleString('vi-vn')
	);
});

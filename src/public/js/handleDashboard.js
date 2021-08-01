const socket = io();
socket.emit('AdminId', 'I am admin');
socket.on('newReview', (review, timeString) => {
	$('#block-notify-comment-review').prepend(`
		<a class="box-notify-comment-review block" href="/admin/review-detail/${review.productId}" target="_blank">
			<div class="flex px-4 space-x-4">
				<div class="relative flex-shrink-0">
					<span class="relative z-10 inline-block overflow-visible rounded-ful">
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${review.userId.avatar}" alt="avatar" /></span>
					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
				</div>
				<div class="flex-1 overflow-hidden">
					<h5 class="text-sm font-semibold text-gray-600 dark:text-light">${review.userId.name} - ${review.rating}⭐</h5>
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">${review.review}</p>
					<span class="text-sm font-normal text-gray-400 dark:text-primary-light">${timeString}</span>
				</div>
			</div>
		</a>
	`);
});

socket.on('newOrder', (order, timeString) => {
	// 	$('#block-notify-order').prepend(`
	// 		<a class="box-notify-order block" href="#">
	// 			<div class="flex px-4 space-x-4">
	// 				<div class="relative flex-shrink-0">
	// 					<span class="z-10 inline-block p-2 overflow-visible rounded-full bg-primary-50 text-primary-light dark:bg-primary-darker">
	// 						<svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	// 							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
	// 						</svg>
	// 					</span>
	// 					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
	// 				</div>
	// 				<div class="flex-1 overflow-hidden">
	// 					<h5 class="text-sm font-semibold text-gray-600 dark:text-light">Test</h5>
	// 					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">hello</p>
	// 					<span class="text-sm font-normal text-gray-400 dark:text-primary-light"> 9h ago</span>
	// 				</div>
	// 			</div>
	// 		</a>
	// 	`);
});

$('.link').hover(
	function () {
		$(this).css('text-decoration', 'underline');
	},
	function () {
		$(this).css('text-decoration', 'none');
	}
);
$('#MyBtnLogout').click(async function () {
	try {
		const res = await axios({
			method: 'GET',
			url: '/api/users/sign-out',
		});
		if (res.data.status === 'success') {
			location.assign('/admin/sign-in');
		}
	} catch (err) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Something went wrong, can not sing out now! please try again',
		});
	}
});
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

import {
	showAlertWaiting,
	showAlertFail,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
} from './handlerActionGeneric.js';
// * HANDLE ReviewDetail.pug, and reuse/export some function in here for other page
function showBoxReply(index) {
	if ($(`#box-reply-${index}`).is(':visible')) {
		$(`#box-reply-${index}`).hide();
	} else {
		$(`#box-reply-${index}`).show();
	}
}
function sendReply(index) {
	const contentReply = document.getElementById(`content-reply-${index}`);
	if (contentReply.value === '') {
		showAlertFail('Content is empty!', 'Please enter your content');
	} else {
		const reviewId = document.querySelector(`.btn-reply-${index}`).getAttribute('review-id');
		handleReply(contentReply.value, reviewId, true);
	}
}

export function handleReply(contentReply, reviewId, reload) {
	return catchAsyncAction(async function () {
		const alertWaiting = showAlertWaiting('Comment is being sent');
		var data = { comment: contentReply };
		var resultReply = await axios({
			method: 'POST',
			url: `/api/users/reviews/${reviewId}/comment`,
			data: data,
		});
		alertWaiting.close();

		if (resultReply.data.status === 'success') {
			if (reload === true) {
				// reload :true -> no need to update readState of comment/review
				await showAlertSuccess('Success', 'Comment was sent');
				location.reload();
			} else {
				return true;
			}
		}
	});
}
function handleDeleteComment(commentId) {
	showAlertConfirmAction('Are you sure?', 'You are sure delete this comment').then(
		async (result) => {
			if (result.isConfirmed) {
				catchAsyncAction(async function () {
					const alertWaiting = showAlertWaiting('Comment is deleted');
					var resultDeleteComment = await axios({
						method: 'DELETE',
						url: `/api/users/reviews/comment/${commentId}/force`,
					});

					if (resultDeleteComment.data.status === 'success') {
						var resultDeleteNotifyComment = await axios({
							method: 'DELETE',
							url: `/api/users/notify-comments/${commentId}/force`,
						});
						alertWaiting.close();
						if (resultDeleteNotifyComment.data.status === 'success') {
							await showAlertSuccess('Success', 'Comment was deleted');
							location.reload();
						}
					}
				});
			}
		}
	);
}
// event open reply
const elementsReply = document.querySelectorAll('img[class^=btn-reply]');
elementsReply.forEach(
	(el) =>
		(el.onclick = function (e) {
			showBoxReply(el.getAttribute('class').split('-')[2]);
		})
);
//event click send
const elementsSend = document.querySelectorAll('div[class*=btn-send]');
elementsSend.forEach(
	(el) =>
		(el.onclick = function (e) {
			sendReply(el.getAttribute('class').split('-')[2]);
		})
);
//event delete comment (not delete review)
const elementsDeleteComment = document.querySelectorAll('img[class^=btn-delete]');
elementsDeleteComment.forEach(
	(el) =>
		(el.onclick = function (e) {
			handleDeleteComment(el.getAttribute('class').split('-')[2]);
		})
);

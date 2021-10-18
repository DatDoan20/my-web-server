// * HANDLE ReviewDetail.pug
import { showAlertRequest, showAlertFail } from './handlerActionGeneric.js';
import { handleReply } from './handlerReviewComment.js';

$('.btnReply').click(async function (e) {
	e.preventDefault();
	const name = $(this).data('name');
	const review = $(this).data('review');
	const rating = $(this).data('rating');

	const comment = await showAlertRequest(`${name} - ${rating}: ${review}`);
	if (comment) {
		handleReply(comment, $(this).data('id'), true);
	} else {
		showAlertFail('Cancel', 'Your comment is empty! or you was cancel');
	}
});

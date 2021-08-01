// * HANDLE ReviewDetail.pug
import {
	showAlertWaiting,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
	showAlertRequest,
	showAlertFail,
} from './handlerActionGeneric.js';
import { handleReply } from './handlerReviewComment.js';

$('.btnReply').click(async function (e) {
	e.preventDefault();
	const comment = await showAlertRequest();
	if (comment) {
		handleReply(comment, $(this).data('id'));
	} else {
		showAlertFail('Fail', 'Your comment is empty!');
	}
});

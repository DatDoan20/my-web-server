import {
	showAlertWaiting,
	showAlertFail,
	showAlertSuccess,
	showAlertConfirmAction,
	catchAsyncAction,
	showAlertWarning,
} from './handlerActionGeneric.js';

function actionOrder(actionMethod, titleWaiting, titleResult, url, actionType, idOrder) {
	catchAsyncAction(async function () {
		var alertWaiting = showAlertWaiting(titleWaiting);
		var resultUpdate = await axios({
			method: actionMethod,
			url: url,
		});
		alertWaiting.close();
		if (resultUpdate.data.status === 'success') {
			alertWaiting = showAlertWaiting(`${titleResult}, sending email...`);

			if (actionType === 'cancel' || actionType === 'accept') {
				//can not use resultUpdate.data.data._id to get idOrder because update(PATCH) will get it,
				//but update(Delete) will not return _id to get
				var resultSendEmail = await axios({
					method: 'GET',
					url: `/admin/orders/send-email/${idOrder}/${actionType}`,
				});
				alertWaiting.close();
				if (resultSendEmail.data.status === 'success') {
					await showAlertSuccess(
						`Sending email success`,
						'Page will automatically reloaded'
					);
				} else {
					await showAlertFail(
						`Sending email error after accepted Order`,
						'Something wrong happened, please try again!'
					);
				}
				location.reload();
			}
		}
	});
}
var btnAccept = $('.btnAccept');
btnAccept.click(function (e) {
	e.preventDefault();
	if ($(`#state-order-${$(this).data('id')}`).attr('state') === 'accepted') {
		showAlertWarning('Can not do it', 'this order is already accepted');
		return;
	}
	showAlertConfirmAction(
		`Order - ${$(this).data('id')} - TotalPayment: ${$(this).data('total')}`,
		'Are you sure? (this action will accept this order)'
	).then((result) => {
		if (result.isConfirmed) {
			actionOrder(
				'PATCH',
				'Order is being accepted',
				'Accepted Order successfully!',
				`/admin/orders/accept/${$(this).data('id')}`,
				'accept',
				$(this).data('id')
			);
		}
	});
});

var btnCancel = $('.btnCancel');
btnCancel.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction(
		`Order - ${$(this).data('id')} - TotalPayment: ${$(this).data('total')}`,
		'Are you sure? (this action will delete this order)'
	).then(async (result) => {
		if (result.isConfirmed) {
			var alertWaiting = showAlertWaiting('Changing state order...');
			//update state canceled -> delete soft notify order -> -> delete soft order -> send email
			var resultCancel = await axios({
				method: 'PATCH',
				url: `/admin/orders/cancel/${$(this).data('id')}`,
			});
			if (resultCancel.data.status === 'success') {
				// delete soft notify order
				var resultDeleteSoftNotifyOrder = await axios({
					method: 'DELETE',
					url: `/api/users/notify-orders/${$(this).data('id')}/soft`,
				});
				alertWaiting.close();
				//delete soft order + send email
				if (resultDeleteSoftNotifyOrder.data.status === 'success') {
					actionOrder(
						'DELETE',
						'Order is being Cancel(delete)',
						'Canceled Order successfully!🗑️',
						`/admin/${$(this).data('id')}/soft`,
						'cancel',
						$(this).data('id')
					);
				}
			}
		}
	});
});

var btnReceive = $('.btnReceive');
btnReceive.click(function (e) {
	e.preventDefault();
	if ($(`#state-order-${$(this).data('id')}`).attr('state') === 'received') {
		showAlertWarning('Can not do it', 'Customer has successfully received');
		return;
	}
	showAlertConfirmAction(
		`Order - ${$(this).data('id')} - TotalPayment: ${$(this).data('total')}`,
		'Are you sure? (this action will check customer has received)'
	).then(async (result) => {
		if (result.isConfirmed) {
			var alertWaiting = showAlertWaiting('Order is being handled');
			var resultUpdateReceived = await axios({
				method: 'PATCH',
				url: `/admin/orders/receive/${$(this).data('id')}`,
			});
			alertWaiting.close();
			if (resultUpdateReceived.data.status === 'success') {
				await showAlertSuccess(`Handle success`, 'Page will automatically reloaded');
			} else {
				await showAlertFail(
					`Check customer has received fail`,
					'Something wrong happened, please try again!'
				);
			}
			location.reload();
		}
	});
});

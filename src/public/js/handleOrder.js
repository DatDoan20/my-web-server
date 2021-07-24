async function showAlertResult(icon, title, text) {
	await Swal.fire({
		position: 'center',
		icon: icon,
		title: title,
		text: text,
		showConfirmButton: false,
		timer: 1500,
	});
}

function showAlertConfirmAction(idOrder, totalPaymentOrder, title) {
	return Swal.fire({
		title: `Are you sure? (this action will ${title} this order)`,
		text: `Order - ${idOrder} - TotalPayment: ${totalPaymentOrder}`,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: `Yes, ${title} it!`,
	});
}

async function actionOrder(actionMethod, titleWaiting, titleResult, url, actionType, idOrder) {
	try {
		const alertWaiting = Swal.fire({
			title: `${titleWaiting}..., Please wait a moment, Do not dismiss!`,
			icon: 'warning',
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: false,
			closeOnClickOutside: false,
		});
		var resultUpdate = await axios({
			method: actionMethod,
			url: url,
		});
		if (resultUpdate.data.status === 'success') {
			alertWaiting.close();
			await showAlertResult('success', `${titleResult}`, 'Page will automatically reloaded');
			if (actionType === 'cancel' || actionType === 'accept') {
				//can nnot use resultUpdate.data.data._id to get idOrder because update(PATCH) will get it,
				//but update(Delete) will not return _id to get
				await axios({
					method: 'GET',
					url: `/admin/orders/send-email/${idOrder}/${actionType}`,
				});
			}
			location.reload();
		}
	} catch (err) {
		console.log(err);
		await showAlertResult(
			'error',
			'Oops...!',
			'Something went wrong!, please try again later.'
		);
		location.reload();
	}
}
var btnAccept = $('.btnAccept');
btnAccept.click(function (e) {
	e.preventDefault();
	showAlertConfirmAction($(this).data('id'), $(this).data('total'), 'accept').then((result) => {
		if (result.isConfirmed) {
			actionOrder(
				'PATCH',
				'Order is being processed(accepted)',
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

	showAlertConfirmAction($(this).data('id'), $(this).data('total'), 'delete').then(
		async (result) => {
			if (result.isConfirmed) {
				//update state -> canceled -> delete soft
				var resultCancel = await axios({
					method: 'PATCH',
					url: `/admin/orders/cancel/${$(this).data('id')}`,
				});
				if (resultCancel.data.status === 'success') {
					actionOrder(
						'DELETE',
						'Order is being Cancel(delete)',
						'Canceled Order successfully!, You can check in Bin late. 🗑️',
						`/admin/${$(this).data('id')}/soft`,
						'cancel',
						$(this).data('id')
					);
				}
			}
		}
	);
});

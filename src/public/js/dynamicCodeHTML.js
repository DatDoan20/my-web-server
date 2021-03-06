export function addHTMLReviewAndCommentElement(
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
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${avatar}" alt="avatar" style ='border:1px solid #555;'/></span>
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
export function addHTMLOrderElement(
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
	} else if (state === 'received') {
		colorState = '#555555';
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
						<img class="object-cover rounded-full w-9 h-9" src="/img/users/${avatar}" alt="avatar" style ='border:1px solid #555;'/></span>
					<div class="absolute h-24 p-px -mt-3 -ml-px bg-primary-50 left-1/2 dark:bg-primary-darker"></div>
				</div>
				<div class="flex-1 overflow-hidden notify-id-${notifyId}" style='opacity:${opacityValue};'>
					<h5 class="text-sm font-semibold text-gray-600 dark:text-light" style="margin-top:5px; margin-bottom:5px;">${name}
						<span style='font-weight: bold; color:#fff; background-color:${colorState}; padding-left:3px; padding-right:3px;
						border-radius:8px;'>${state}</span>
					</h5>
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">S??? l?????ng s???n ph???m: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${numberOfProducts}</span>
					</p>

					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">T???ng gi?? ????n h??ng: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${totalPayment}??</span>
					</p>

					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Ph????ng th???c thanh to??n: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${paymentMode}</span>
					</p>

					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Ng?????i nh???n: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${receiverName}</span>
					</p>
					
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">?????a ch???: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${addressDelivery}</span>
					</p>
					
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">Email: 
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${receiverEmail}</span>
					</p>
					
					<p class="text-sm font-normal text-gray-400 truncate dark:text-primary-lighter">S??? ??i???n tho???i:
						<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${receiverPhone}</span>
					</p>
					
					<span class="text-sm font-normal text-gray-400 dark:text-primary-light" style="font-weight: bold;">${time}</span>
				</div>
			</div>
		</a>
	`);
}
export function typeNam() {
	const typeNam = `
	<optgroup label="??o tay d??i">
		<option value="ao-thun-tay-dai">??o thun tay d??i</option>
		<option value="ao-so-mi-tay-dai">??o s?? mi tay d??i</option>
		<option value="ao-chat-lieu-khac-dai">??o ch???t li???u kh??c tay d??i</option>
	</optgroup>
	<optgroup label="??o tay ng???n">
		<option value="ao-thun-tay-ngan">??o thun tay ng???n</option>
		<option value="ao-so-mi-tay-ngan">??o s?? mi tay ng???n</option>
		<option value="ao-chat-lieu-khac-ngan">??o ch???t li???u kh??c tay ng???n</option>
	</optgroup>
	<optgroup label="Qu???n d??i">
		<option value="quan-thun-dai">Qu???n thun d??i</option>
		<option value="quan-tay-dai">Qu???n t??y d??i</option>
		<option value="quan-kaki-dai">Qu???n kaki d??i</option>
		<option value="quan-jean-dai">Qu???n jean d??i</option>
		<option value="quan-chat-lieu-khac-dai">Qu???n ch???t li???u kh??c d??i</option>
	</optgroup>
	<optgroup label="Qu???n short">
		<option value="quan-thun-ngan">Qu???n thun short</option>
		<option value="quan-tay-ngan">Qu???n t??y short</option>
		<option value="quan-kaki-ngan">Qu???n kaki short</option>
		<option value="quan-jean-ngan">Qu???n jean short</option>
		<option value="quan-chat-lieu-khac-ngan">Qu???n ch???t li???u kh??c ng???n</option>
	</optgroup>
	<optgroup label="M???t h??ng Kh??c">
		<option value="do-bo">????? b???</option>
		<option value="do-the-thao">????? th??? thao</option>
		<option value="ao-khoac">??o kho??c</option>
	</optgroup>
		<optgroup label="M???t h??ng Kh??c">
		<option value="do-the-thao">????? th??? thao</option>
	</optgroup>
	`;
	return typeNam;
}
export function typeNu() {
	const typeNu = `
	<optgroup label="?????m/V??y">
		<option value="vay-suong">V??y su??ng </option>
		<option value="chan-vay">Ch??n v??y</option>
	</optgroup>
	<optgroup label="??o tay d??i">
		<option value="ao-thun-tay-dai">??o thun tay d??i</option>
		<option value="ao-so-mi-tay-dai">??o s?? mi tay d??i</option>
		<option value="ao-chat-lieu-khac-dai">??o ch???t li???u kh??c tay d??i</option>
	</optgroup>
	<optgroup label="??o tay ng???n">
		<option value="ao-thun-tay-ngan">??o thun tay ng???n</option>
		<option value="ao-so-mi-tay-ngan">??o s?? mi tay ng???n</option>
		<option value="ao-chat-lieu-khac-ngan">??o ch???t li???u kh??c tay ng???n</option>
	</optgroup>
	<optgroup label="Qu???n d??i">
		<option value="quan-thun-dai">Qu???n thun d??i</option>
		<option value="quan-tay-dai">Qu???n t??y d??i</option>
		<option value="quan-kaki-dai">Qu???n kaki d??i</option>
		<option value="quan-jean-dai">Qu???n jean d??i</option>
		<option value="quan-chat-lieu-khac-dai">Qu???n ch???t li???u kh??c d??i</option>
	</optgroup>
	<optgroup label="Qu???n short">
		<option value="quan-thun-ngan">Qu???n thun short</option>
		<option value="quan-tay-ngan">Qu???n t??y short</option>
		<option value="quan-kaki-ngan">Qu???n kaki short</option>
		<option value="quan-jean-ngan">Qu???n jean short</option>
		<option value="quan-chat-lieu-khac-ngan">Qu???n ch???t li???u kh??c ng???n</option>
	</optgroup>
	<optgroup label="M???t h??ng Kh??c">
		<option value="do-bo">????? b???</option>
		<option value="do-the-thao">????? th??? thao</option>
		<option value="ao-khoac">??o kho??c</option>
	</optgroup>
		<optgroup label="M???t h??ng Kh??c">
		<option value="do-the-thao">????? th??? thao</option>
	</optgroup>
	`;
	return typeNu;
}
export function typeNamNu() {
	const typeNamNu = `
	<optgroup label="M???t h??ng Kh??c">
		<option value="do-the-thao">????? th??? thao</option>
	</optgroup>
	<optgroup label="Ph??? ki???n">
		<option value="non">N??n</option>
		<option value="khan-choang-co">Kh??n cho??ng c???</option>
	</optgroup>
	`;
	return typeNamNu;
}

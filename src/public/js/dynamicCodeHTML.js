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
export function typeNam() {
	const typeNam = `
	<optgroup label="Áo">
		<option value="ao-thun-tay-dai">Áo thun tay dài</option>
		<option value="ao-thun-tay-ngan">Áo thun tay ngắn</option>
		<option value="ao-so-mi-tay-dai">Áo sơ mi tay dài</option>
		<option value="ao-so-mi-tay-ngan">Áo sơ mi tay ngắn</option>
	</optgroup>
	<optgroup label="Quần dài">
		<option value="quan-thun-dai">Quần thun dài</option>
		<option value="quan-tay-dai">Quần tây dài</option>
		<option value="quan-kaki-dai">Quần kaki dài</option>
		<option value="quan-jean-dai">Quần jean dài</option>
	</optgroup>
	<optgroup label="Quần short">
		<option value="quan-thun-ngan">Quần thun short</option>
		<option value="quan-tay-ngan">Quần tây short</option>
		<option value="quan-kaki-ngan">Quần kaki short</option>
		<option value="quan-jean-ngan">Quần jean short</option>
	</optgroup>
	<optgroup label="Khác">
		<option value="do-bo">Đồ bộ</option>
		<option value="do-the-thao">Đồ thể thao</option>
		<option value="ao-khoac">Áo khoác</option>
	</optgroup>
	<optgroup label="Phụ kiện">
		<option value="non">Nón</option>
		<option value="khan-choang-co">Khăn choàng cổ</option>
	</optgroup>
	`;
	return typeNam;
}
export function typeNu() {
	const typeNu = `
	<optgroup label="Đầm/Váy">
		<option value="vay-suong">Váy suông </option>
		<option value="chan-vay">Chân váy</option>
	</optgroup>
	<optgroup label="Áo">
		<option value="ao-thun-tay-dai">Áo thun tay dài</option>
		<option value="ao-thun-tay-ngan">Áo thun tay ngắn</option>
		<option value="ao-so-mi-tay-dai">Áo sơ mi tay dài</option>
		<option value="ao-so-mi-tay-ngan">Áo sơ mi tay ngắn</option>
	</optgroup>
	<optgroup label="Quần dài">
		<option value="quan-thun-dai">Quần thun dài</option>
		<option value="quan-tay-dai">Quần tây dài</option>
		<option value="quan-kaki-dai">Quần kaki dài</option>
		<option value="quan-jean-dai">Quần jean dài</option>
	</optgroup>
	<optgroup label="Quần short">
		<option value="quan-thun-ngan">Quần thun short</option>
		<option value="quan-tay-ngan">Quần tây short</option>
		<option value="quan-kaki-ngan">Quần kaki short</option>
		<option value="quan-jean-ngan">Quần jean short</option>
	</optgroup>
	<optgroup label="Khác">
		<option value="do-bo">Đồ bộ</option>
		<option value="do-the-thao">Đồ thể thao</option>
		<option value="ao-khoac">Áo khoác</option>
	</optgroup>
	<optgroup label="Phụ kiện">
		<option value="non">Nón</option>
		<option value="khan-choang-co">Khăn choàng cổ</option>
	</optgroup>
	`;
	return typeNu;
}

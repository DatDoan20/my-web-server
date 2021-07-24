function Validator(formSelector) {
	var _this = this;
	//BUILD HANDLE FUNCTION
	/** object chua cac function
	 * - Neu co loi -> error Msg
	 * - Neu hop le -> undefined
	 */
	var validatorRules = {
		required: function (value) {
			return value ? undefined : 'vui long nhap truong nay';
		},
		email: function (value) {
			var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			return regex.test(value) ? undefined : 'vui long nhap email hop le';
		},
		min: function (min) {
			return function (value) {
				return value.length >= min ? undefined : `do dai it nhat ${min} ky tu`;
			};
		},
		phone: function (value) {
			var regex = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/;
			return regex.test(value) ? undefined : 'vui long nhap số điện thoại hợp lệ';
		},
	};

	function getParent(inputElement, selector) {
		// selector is 'form-group'

		while (inputElement.parentElement) {
			if (inputElement.parentElement.matches(selector)) {
				return inputElement.parentElement;
			}
			inputElement = inputElement.parentElement;
		}
	}

	//HANDLER

	//chua cac id name va cac function tuong ung vs rules attribute
	var formRules = {};

	var formElement = document.querySelector(formSelector);
	if (formElement) {
		//FOR : 1. LAY RA DC CAC THUOC TINH: [FUNCTION,...] IN "formRules"
		//	2. LANG NGHE SU KIEN

		//node list
		var inputs = formElement.querySelectorAll('[name][rules]');
		//get value(input) of inputs, input is card <input>
		for (var input of inputs) {
			//getAttribute: required|email => [required, email], [min:6]
			var inputSeparated = input.getAttribute('rules').split('|');

			for (var rule of inputSeparated) {
				var ruleInfo;
				var isRuleHasValue = rule.includes(':');
				//separate rule: [min:6] -> rule: [min]
				if (isRuleHasValue) {
					ruleInfo = rule.split(':');
					rule = ruleInfo[0];
				}
				console.log(rule);
				//rule are required / email , min
				var ruleFunction = validatorRules[rule];

				if (isRuleHasValue) {
					//call function min(6)
					ruleFunction = ruleFunction(ruleInfo[1]);
				}

				//add function corresponding to 'name'(email, fullname...)
				if (Array.isArray(formRules[input.name])) {
					//email: [function required, function email]
					formRules[input.name].push(ruleFunction);
				} else {
					//email: [function required,]
					formRules[input.name] = [ruleFunction];
				}
			}

			// 2. LANG NGHE SU KIEN DE VALIDATE (blur, change)
			input.onblur = handleValidate;
			input.oninput = handleClearError;
		}
		function handleValidate(e) {
			var events = formRules[e.target.name];
			var errMsg;
			//find error with for loop
			for (var event of events) {
				errMsg = event(e.target.value);
				if (errMsg) break;
			}

			//show errorMsg to UI
			if (errMsg) {
				var formGroup = getParent(e.target, '.form-group');
				if (formGroup) {
					formGroup.classList.add('invalid');
					var formMsg = formGroup.querySelector('.form-message');
					if (formMsg) {
						formMsg.innerText = errMsg;
					}
				}
			}
			return !errMsg; // khong loi -> errMsg == '' -> false + ! -> true
		}
		function handleClearError(e) {
			var formGroup = getParent(e.target, '.form-group');
			if (formGroup.classList.contains('invalid')) {
				formGroup.classList.remove('invalid');
			}
			var formMsg = formGroup.querySelector('.form-message');
			if (formMsg) {
				formMsg.innerText = '';
			}
		}
		// console.log(formRules)
	}
	formElement.onsubmit = function (e) {
		e.preventDefault();
		var inputs = formElement.querySelectorAll('[name][rules]');

		var isValid = true;

		for (var input of inputs) {
			var checkError = handleValidate({ target: input });
			if (!checkError) {
				isValid = false;
			}
		}
		//pass data
		if (isValid) {
			// console.log(typeof _this)
			if (typeof _this.onSingIn === 'function') {
				//nodeList
				var enableInputs = formElement.querySelectorAll('[name]');
				var formData = Array.from(enableInputs).reduce(function (acc, crr) {
					acc[crr.name] = crr.value;
					return acc;
				}, {});
				_this.onSingIn(formData);
			}
		}
	};
}

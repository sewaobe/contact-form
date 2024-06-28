function Validator(formSelector, options) {
    var formElement = document.querySelector(formSelector);
    var formRules = {};
    var formData = {};
    var __this = this;

    //Get parent and error elements in input error
    function getErrorElement(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.querySelector(selector))
                return {
                    parentElement: element.parentElement,
                    errorElement: element.parentElement.querySelector(selector),
                };
            element = element.parentElement;
        }
    }

    //Custom function submit
    function handleSubmit(formElement, inputs) {
        formElement.onsubmit = e => {
            var isValid = true;

            e.preventDefault();
            for (var input of inputs) {
                switch (input.type) {
                    case 'radio':
                        input.checked ? (formData[input.name] = input.value) : 'No checked';

                        break;
                    case 'checkbox':
                        input.checked
                            ? Array.isArray(formData[input.name])
                                ? formData[input.name].push(input.value)
                                : (formData[input.name] = [input.value])
                            : 'No checked';
                        break;
                    default:
                        // Get value input text
                        formData[input.name] = input.value;

                        break;
                }
                if (!handleInputValid(input)) {
                    isValid = false;
                }
            }

            if (isValid) {
                toastMessage();
                __this.onSubmit(formData);
            }
        };
    }

    //function validatorRules => Defined rules for validation.
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'The field is required';
        },

        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})/;
            return regex.test(value) ? undefined : 'Please enter a valid email address';
        },
    };

    //function checked any input has error messages.
    var handleInputValid = e => {
        var input = e.target ? e.target : e;

        var errorMessage;
        var { parentElement, errorElement } = getErrorElement(input, options.errorElement);
        switch (input.type) {
            case 'radio':
                // Get value input text => Has: set value / No has: Set error message.
                parentElement.querySelectorAll('input[type="radio"]:checked').length !== 0
                    ? 'Checked'
                    : (errorMessage = 'Please select a query type');

                if (input.checked) {
                    for (var ip of Array.from(
                        parentElement.querySelectorAll('input[type="radio"]')
                    )) {
                        if (ip.parentElement.classList.contains('isChecked')) {
                            ip.parentElement.classList.remove('isChecked');
                        }
                    }

                    input.parentElement.classList.add('isChecked');
                }
                break;
            case 'checkbox':
                parentElement.querySelectorAll('input[type="checkbox"]:checked').length !== 0
                    ? 'Checked'
                    : (errorMessage = 'To submit this form, please consent to being contacted');
                break;
            default:
                break;
        }

        //Check invalid first => break && display error message
        for (var validType of formRules[input.name]) {
            if (errorMessage) break;

            errorMessage = validType(input.value);
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            parentElement.classList.add('inValid');
        } else {
            errorElement.innerText = '';
            parentElement.classList.remove('inValid');
        }
        return !errorMessage;
    };

    // has formElement
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');

        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');

            //Add validator of input to formRules.
            for (var rule of rules) {
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(validatorRules[rule]);
                } else {
                    formRules[input.name] = [validatorRules[rule]];
                }
            }

            //Event onblur => Check errors messages!
            input.onblur = handleInputValid;
        }

        //submit form
        handleSubmit(formElement, inputs);
    }
}

function toastMessage() {
    const toast = document.querySelector('#toastMessage');
    if (toast) {
        const toastMessage = document.createElement('div');
        for (var toastPre of toast.querySelectorAll('.toastMessageSuccess')) {
            toast.removeChild(toastPre);
        }
        toastMessage.classList.add('toastMessageSuccess');

        toastMessage.innerHTML = `  
            <div class="titleToastMessage">
                <img src="./assets/images/icon-success-check.svg" alt="No icon" />
                <h3>Message Sent!</h3>
                </div>
                <p>Thanks for completing the form. We'll be in touch soon!</p>
        `;

        toast.appendChild(toastMessage);
    }
}

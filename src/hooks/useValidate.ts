export default function useValidate(formInputs: FormInputsType) {
    const validateAllInputs = () => {
        Object.keys(formInputs).map((key) => {
            [validateUsername, validatePassword, validateCofirmPassword].map(
                (validationFunc) => {
                    if (validationFunc.name.includes(key))
                        validationFunc(formInputs[key].value);
                },
            );
        });
    };

    const validateUsername = (currentInputValue = '') => {
        return preValidate(
            formInputs['username'],
            currentInputValue,
            formInputs,
        );
    };

    const validatePassword = (currentInputValue = '') => {
        return preValidate(
            formInputs['password'],
            currentInputValue,
            formInputs,
        );
    };

    const validateCofirmPassword = (currentInputValue = '') => {
        return preValidate(
            formInputs['confirmPassword'],
            currentInputValue,
            formInputs,
        );
    };

    return {
        validateUsername,
        validatePassword,
        validateAllInputs,
        validateCofirmPassword,
    };
}

function preValidate(
    input: FormInputPropsType,
    currentInputValue: string,
    formInputs: FormInputsType,
) {
    setAndResetInput(input, currentInputValue);
    return validate(input, currentInputValue, formInputs);
}

function setAndResetInput(
    input: FormInputPropsType,
    currentInputValue: string,
) {
    input.isEmpty = false;
    while (input.errors.length > 0) {
        input.errors.pop();
    }
    input.value = currentInputValue;
}

function validate(
    input: FormInputPropsType,
    currentInputValue: string,
    formInputs: FormInputsType,
) {
    if (!input.validations) return;
    if (!currentInputValue) {
        input.isEmpty = true;
        return;
    }
    const validations = input.validations(currentInputValue, formInputs);
    validations.map((validation) => {
        if (validation.coditional) input.errors.push(validation.message);
    });

    if (input.errors.length < 1) return;
    return input.errors;
}

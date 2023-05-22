export default function useValidate(formInputs: FormInputsType) {
    const validateAllInputs = () => {
        Object.keys(formInputs).map((key) => {
            Object.values(inputsValidation).map((validationFunc) => {
                if (validationFunc.name.includes(key))
                    validationFunc(formInputs[key].value);
            });
        });

        const verificationArray = [];
        for (const i in formInputs) {
            if (formInputs[i].errors?.length >= 1 || formInputs[i].isEmpty) {
                verificationArray.push(1);
            } else {
                verificationArray.push(0);
            }
        }
        return verificationArray.find((value) => value === 1);
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

    const inputsValidation = {
        validateUsername,
        validatePassword,
        validateCofirmPassword,
    };

    return { ...inputsValidation, validateAllInputs };
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

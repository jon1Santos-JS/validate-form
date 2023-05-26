export default function useValidate(formInputs: FormInputsType) {
    const validateAllInputs = () => {
        const formInputsProps = Object.keys(formInputs);
        formInputsProps.forEach((inputName) => {
            const validationFunction = getInputValidationFunction(
                inputsValidation,
                inputName,
            );
            validationFunction(formInputs[inputName].value);
        });

        const verificationArray = [];
        for (const i in formInputs) {
            if (formInputs[i].errors?.length >= 1) {
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

    const validateConfirmPassword = (currentInputValue = '') => {
        return preValidate(
            formInputs['confirmPassword'],
            currentInputValue,
            formInputs,
        );
    };

    const inputsValidation = {
        validateUsername,
        validatePassword,
        validateConfirmPassword,
    };

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
        if (!currentInputValue && input.required) {
            input.errors.push('This field is required');
            return input.errors;
        }
        if (!currentInputValue) return;

        input.validations(currentInputValue, formInputs).map((validation) => {
            if (validation.coditional) input.errors.push(validation.message);
        });

        if (input.errors.length < 1) return;
        return input.errors;
    }

    return { ...inputsValidation, validateAllInputs };
}

function getInputValidationFunction(
    validationFunctions: ReturnValidationFunctionsType,
    inputName: string,
) {
    const handledFunctions = Object.values(validationFunctions);
    const validationFunctionFound = handledFunctions.filter(
        (validationFunc) => {
            const handledFunctionName = validationFunc.name
                .toLowerCase()
                .replace('validate', '');
            const handledInputName = inputName.toLowerCase();
            if (handledFunctionName === handledInputName) {
                return validationFunc;
            }
            return;
        },
    );
    return validationFunctionFound[0];
}

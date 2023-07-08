const EMPTY_INPUT_ERROR_RESPONSE = 'This field is required';

export default function useValidate() {
    const validateAllInputs = (formInputs: FormInputsType) => {
        const inputsKeys = Object.keys(formInputs);
        const inputErrors = inputsKeys.map((inputName) => {
            return preValidate(inputName, formInputs);
        });
        const validations = inputErrors.map((error) => {
            if (!error) return false;
            if (error.length >= 1) return true;
            return false;
        });
        const validation = validations.find(
            (validation) => validation === true,
        );
        const findConditional = validation === undefined ? false : validation;

        return findConditional;
    };

    const preValidate = (fieldName: string, formInputs: FormInputsType) => {
        setAndResetInput(formInputs[fieldName]);
        return validate(formInputs[fieldName], formInputs);
    };

    function setAndResetInput(objectfiedInput: FormInputPropsType) {
        while (objectfiedInput.errors.length > 0) {
            objectfiedInput.errors.pop();
        }
    }

    function validate(
        currentInput: FormInputPropsType,
        formInputs: FormInputsType,
    ) {
        if (!currentInput.validations) return currentInput.errors;
        if (!currentInput.value && currentInput.required) {
            if (typeof currentInput.required === 'string') {
                currentInput.errors.push(currentInput.required);
                return currentInput.errors;
            }
            currentInput.errors.push(EMPTY_INPUT_ERROR_RESPONSE);
            return currentInput.errors;
        }
        if (!currentInput.value) return currentInput.errors;

        currentInput
            .validations(currentInput.value, formInputs)
            .map((validation) => {
                const message = validation.message ? validation.message : '';
                if (validation.coditional) currentInput.errors.push(message);
            });
        return currentInput.errors;
    }

    return { preValidate, validateAllInputs };
}

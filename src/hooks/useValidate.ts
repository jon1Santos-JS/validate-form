const EMPTY_INPUT_ERROR_RESPONSE = 'This field is required';

export default function useValidate<T extends string>(
    inputs: InputsToValidateType<T>,
) {
    function manyValidation() {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function uniqueValidation(input: ValidateInputType<T>) {
        const { value, required, errors } = input;
        cleanArray(errors);
        if (!value && required) {
            if (typeof required === 'string') {
                errors.push(required);
                return errors;
            }
            errors.push(EMPTY_INPUT_ERROR_RESPONSE);
            return errors;
        }
        return validate(input);
    }

    function validate(input: ValidateInputType<T>) {
        const { value, validations, errors } = input;
        if (!validations) return errors;
        if (!value) return errors;

        validations(value, inputs).map((validation) => {
            const message = validation.message ? validation.message : '';
            if (validation.coditional) errors.push(message);
        });
        return errors;
    }

    return { uniqueValidation, manyValidation };
}

function cleanArray(arrayToClean: string[]) {
    while (arrayToClean.length > 0) {
        arrayToClean.pop();
    }
}

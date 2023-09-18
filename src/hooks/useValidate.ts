const EMPTY_INPUT_ERROR_RESPONSE = 'This field is required';

export default function useValidate<T extends string>(
    inputs: HandledInputsType<T, ValidateInputType<T>>,
) {
    function validateAll() {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].errors.length > 0) isValid = false;
            else isValid = true;
        }
        return isValid;
    }

    function preValidate(content: ValidateInputType<T>) {
        const { value, required, errors } = content;
        cleanArray(errors);
        if (!value && required) {
            if (typeof required === 'string') {
                errors.push(required);
                return errors;
            }
            errors.push(EMPTY_INPUT_ERROR_RESPONSE);
            return errors;
        }
        return validate(content);
    }

    function validate(content: ValidateInputType<T>) {
        const { value, validations, errors } = content;
        if (!validations) return errors;
        if (!value) return errors;

        validations(value, inputs).map((validation) => {
            const message = validation.message ? validation.message : '';
            if (validation.coditional) errors.push(message);
        });
        return errors;
    }

    return { preValidate, validateAll };
}

function cleanArray(arrayToClean: string[]) {
    while (arrayToClean.length > 0) {
        arrayToClean.pop();
    }
}

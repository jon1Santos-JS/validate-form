export default function useValidate<T extends string>() {
    function manyValidation(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function uniqueValidation(
        input: ValidateInputType<T>,
        conditionalInput?: ValidateInputType<T>,
    ) {
        const { value, required, errors } = input;
        cleanArray(errors);
        if (!value && required) {
            if (typeof required === 'string') {
                errors.push(required);
                return input;
            }
            errors.push('');
            return input;
        }
        return validate(input, conditionalInput);
    }

    function validate(
        input: ValidateInputType<T>,
        conditionalInput?: ValidateInputType<T>,
    ) {
        const { value, validations, errors } = input;

        if (!validations) return input;
        if (!value) return input;

        validations(value, conditionalInput && conditionalInput.value).map(
            (validation) => {
                const message = validation.message ? validation.message : '';
                if (validation.coditional) errors.push(message);
            },
        );
        return input;
    }

    return { uniqueValidation, manyValidation };
}

function cleanArray(arrayToClean: string[]) {
    while (arrayToClean.length > 0) {
        arrayToClean.pop();
    }
}

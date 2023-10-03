export default function useValidate() {
    function manyValidation<T extends string>(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function uniqueValidation<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
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
        return validate(input, inputs);
    }

    function validate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { value, validations, errors } = input;

        if (!validations) return input;
        if (!value) return input;

        validations(value, inputs && inputs).map((validation) => {
            const message = validation.message ? validation.message : '';
            if (validation.coditional) errors.push(message);
        });
        return input;
    }

    return { uniqueValidation, manyValidation };
}

function cleanArray(arrayToClean: string[]) {
    while (arrayToClean.length > 0) {
        arrayToClean.pop();
    }
}

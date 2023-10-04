export default function useValidate() {
    function manyValidation<T extends string>(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            const validatedInput = uniqueValidation(inputs[i], inputs);
            if (validatedInput.errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function uniqueValidation<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { errors, cleanErrors } = input;
        if (typeof cleanErrors === 'undefined' || cleanErrors === true)
            cleanArray(errors);
        delete input.cleanErrors;
        return validate(input, inputs);
    }

    function validate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { value, validations, errors } = input;

        if (!validations) return input;

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

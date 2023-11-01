export default function useValidate() {
    function validateMany<T extends string>(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            if (inputs[i].required && !inputs[i].value)
                onCheckRequired(inputs[i]);
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    async function asyncValidateSingle<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        validate(input, inputs);
        crossfieldValidate(input, inputs);
        await asyncValidate(input, inputs);
        return input;
    }

    function validateSingle<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        validate(input, inputs);
        crossfieldValidate(input, inputs);
        return input;
    }

    function validate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { value, validations, required } = input;
        const newErrors: string[] = [];

        if (required && !value) {
            onCheckRequired(input);
            return;
        }
        if (!validations) return;
        validations(value, inputs && inputs).forEach(
            ({ conditional, message }) => {
                if (conditional) newErrors.push(message);
            },
        );
        input.errors = [...newErrors];
    }

    function crossfieldValidate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        if (!input.crossfields || !inputs) return;
        if (input.crossfields.length === 0) return;
        input.crossfields.forEach((crossInput) => {
            if (!inputs[crossInput].value) return;
            validate(inputs[crossInput], inputs);
        });
    }

    async function asyncValidate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        if (input.errors.length > 0) return;
        await asyncronizedValidate(input, inputs);
    }

    async function asyncronizedValidate<T extends string>(
        input: ValidateInputType<T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { value, asyncValidations } = input;
        const newErrors: string[] = [];
        if (!asyncValidations) return;
        (await asyncValidations(value, inputs && inputs)).forEach(
            ({ conditional, message }) => {
                if (conditional) newErrors.push(message);
            },
        );
        input.errors = [...newErrors];
    }

    function onCheckRequired<T extends string>(input: ValidateInputType<T>) {
        const conditional =
            typeof input.required === 'string' ? input.required : '';
        input.errors.push(conditional);
    }

    return { validateSingle, asyncValidateSingle, validateMany };
}

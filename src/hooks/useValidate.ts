export default function useValidate() {
    function validateMany<T extends string>(inputs: InputsToValidateType<T>) {
        let isValid = true;
        for (const i in inputs) {
            onCheckRequired(inputs[i]);
            if (inputs[i].errors.length > 0) isValid = false;
        }
        return isValid;
    }

    function validateSingleSync<T extends string>(
        input: ValidateInputType<T, T>,
        inputs?: InputsToValidateType<T>,
    ) {
        validate(input, inputs);
        crossfieldValidate(input, inputs);
        return input;
    }

    async function validateSingle<T extends string>(
        input: ValidateInputType<T, T>,
        inputs?: InputsToValidateType<T>,
    ) {
        validate(input, inputs);
        crossfieldValidate(input, inputs);
        await asyncValidate(input, inputs);
        return input;
    }

    function validate<T extends string>(
        input: ValidateInputType<T, T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { attributes, validationsSync } = input;
        const newErrors: string[] = [];

        if (onCheckRequired(input)) return;
        if (!validationsSync) return;
        validationsSync(attributes, inputs && inputs).forEach(
            ({ conditional, message }) => {
                if (conditional) newErrors.push(message);
            },
        );
        input.errors = [...newErrors];
    }

    async function asyncValidate<T extends string>(
        input: ValidateInputType<T, T>,
        inputs?: InputsToValidateType<T>,
    ) {
        if (input.errors.length > 0) return;
        await asyncronizedValidate(input, inputs);
    }

    async function asyncronizedValidate<T extends string>(
        input: ValidateInputType<T, T>,
        inputs?: InputsToValidateType<T>,
    ) {
        const { attributes, validations } = input;
        const newErrors: string[] = [];
        if (!validations) return;
        (await validations(attributes, inputs && inputs)).forEach(
            ({ conditional, message }) => {
                if (conditional) newErrors.push(message);
            },
        );
        input.errors = [...newErrors];
    }

    function crossfieldValidate<T extends string>(
        input: ValidateInputType<T, T>,
        inputs?: InputsToValidateType<T>,
    ) {
        if (!input.crossfields || !inputs) return;
        if (input.crossfields.length === 0) return;
        input.crossfields.forEach((crossInput) => {
            if (!inputs[crossInput].attributes.value) return;
            validate(inputs[crossInput], inputs);
        });
    }

    function onCheckRequired<T extends string>(input: ValidateInputType<T, T>) {
        const { attributes, required } = input;
        if (!attributes.value && required?.value) {
            if (!required.message) {
                input.errors.push('');
                return true;
            }
            input.errors.push(required.message);
            return true;
        }
        return false;
    }

    return {
        validateSingleSync,
        validateSingle,
        validateMany,
    };
}

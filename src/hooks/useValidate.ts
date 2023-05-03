enum InputKey {
    USERNAME = 'username',
    PASSWORD = 'password',
    CONFIRM_PASSWORD = 'confirmPassword',
}

export default function useValidate(inputs: InputsType) {
    const validateAll = () => {
        if (
            inputs[InputKey.USERNAME] &&
            inputs[InputKey.PASSWORD] &&
            inputs[InputKey.CONFIRM_PASSWORD]
        ) {
            validateUsername(inputs[InputKey.USERNAME].value as string);
            validatePassword(inputs[InputKey.PASSWORD].value as string);
            cofirmPassword(inputs[InputKey.CONFIRM_PASSWORD].value as string);
        }
    };

    const validateUsername = (currentInputValue: string) => {
        if (!inputs[InputKey.USERNAME]) return;
        if (!currentInputValue) {
            inputs[InputKey.USERNAME].isEmpty = true;
            return;
        }

        inputs[InputKey.USERNAME].validations = [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/\D/),
                message: 'Only strings',
            },
        ];

        return validate(inputs[InputKey.USERNAME], currentInputValue);
    };

    const validatePassword = (currentInputValue: string) => {
        if (!inputs[InputKey.PASSWORD]) return;
        if (!currentInputValue) {
            inputs[InputKey.PASSWORD].isEmpty = true;
            return;
        }

        inputs[InputKey.PASSWORD].validations = [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
        ];

        return validate(inputs[InputKey.PASSWORD], currentInputValue);
    };

    const cofirmPassword = (currentInputValue: string) => {
        if (!inputs[InputKey.CONFIRM_PASSWORD] || !inputs[InputKey.PASSWORD])
            return;
        if (!currentInputValue) {
            inputs[InputKey.CONFIRM_PASSWORD].isEmpty = true;
            return;
        }

        inputs[InputKey.CONFIRM_PASSWORD].validations = [
            {
                coditional:
                    currentInputValue !== inputs[InputKey.PASSWORD].value,
                message: 'This field has to be equal to the password',
            },
        ];

        return validate(inputs[InputKey.CONFIRM_PASSWORD], currentInputValue);
    };

    return {
        validateUsername,
        validatePassword,
        cofirmPassword,
        validateAll,
    };

    function validate(input: InputPropsType, currentInputValue: string) {
        const error: string[] = [];
        clearErrorList(input.errors);
        input.value = currentInputValue;
        input.validations?.map((validation) => {
            if (validation.coditional) error.push(validation.message);
        });

        if (error.length >= 1) input.errors.push(...error);
        input.isEmpty = false;
        return input.errors;
    }

    function clearErrorList(list: string[]) {
        while (list.length > 0) {
            list.pop();
        }
    }
}

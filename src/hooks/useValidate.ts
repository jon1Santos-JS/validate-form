enum InputKey {
    USERNAME = 'username',
    PASSWORD = 'password',
    CONFIRM_PASSWORD = 'confirmPassword',
}

export default function useValidate(formInputs: FormInputsType) {
    const validateAllInputs = () => {
        if (
            formInputs[InputKey.USERNAME] &&
            formInputs[InputKey.PASSWORD] &&
            formInputs[InputKey.CONFIRM_PASSWORD]
        ) {
            validateUsername(formInputs[InputKey.USERNAME].value as string);
            validatePassword(formInputs[InputKey.PASSWORD].value as string);
            cofirmPassword(
                formInputs[InputKey.CONFIRM_PASSWORD].value as string,
            );
        }
    };

    const validateUsername = (currentInputValue: string) => {
        if (!currentInputValue) {
            formInputs[InputKey.USERNAME].isEmpty = true;
            return;
        }

        formInputs[InputKey.USERNAME].validations = [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/\D/),
                message: 'Only strings',
            },
        ];

        return validate(formInputs[InputKey.USERNAME], currentInputValue);
    };

    const validatePassword = (currentInputValue: string) => {
        if (!currentInputValue) {
            formInputs[InputKey.PASSWORD].isEmpty = true;
            return;
        }

        formInputs[InputKey.PASSWORD].validations = [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
        ];

        return validate(formInputs[InputKey.PASSWORD], currentInputValue);
    };

    const cofirmPassword = (currentInputValue: string) => {
        if (!currentInputValue) {
            formInputs[InputKey.CONFIRM_PASSWORD].isEmpty = true;
            return;
        }

        formInputs[InputKey.CONFIRM_PASSWORD].validations = [
            {
                coditional:
                    currentInputValue !== formInputs[InputKey.PASSWORD].value,
                message: 'This field has to be equal to the password',
            },
        ];

        return validate(
            formInputs[InputKey.CONFIRM_PASSWORD],
            currentInputValue,
        );
    };

    return {
        validateUsername,
        validatePassword,
        validateAllInputs,
        cofirmPassword,
    };

    function validate(input: FormInputPropsType, currentInputValue: string) {
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

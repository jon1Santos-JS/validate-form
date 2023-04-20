export interface Validate {
    username: { input: string; errors: string[] };
    password: { input: string; errors: string[] };
    confirmPassword: { input: string; errors: string[] };
}

export type ValidateObjectKeyTypes =
    | 'username'
    | 'password'
    | 'confirmPassword';

enum Fields {
    USERNAME = 'username',
    PASSWORD = 'password',
    CONFIRM_PASSWORD = 'confirmPassword',
}

export default function useValidate() {
    const validate: Validate = {
        username: { input: '', errors: ['This field is empty'] },
        password: { input: '', errors: ['This field is empty'] },
        confirmPassword: { input: '', errors: ['This field is empty'] },
    };

    const validateUsername = (currentInput: string) => {
        validate[Fields.USERNAME].input = currentInput;
        const error: string[] = [];

        clearValidate(Fields.USERNAME);

        if (!currentInput.match(/.{6,}/)) {
            error.push('Username must has 6 characters at least');
        }

        if (error.length === 0) clearValidate(Fields.USERNAME);
        else validate[Fields.USERNAME].errors.push(...error);

        return validate[Fields.USERNAME].errors;
    };

    const validatePassword = (currentInput: string) => {
        validate[Fields.PASSWORD].input = currentInput;
        const error = [];

        clearValidate(Fields.PASSWORD);

        if (!currentInput.match(/.{6,}/)) {
            error.push('Password must has 6 characters at least');
        }

        if (error.length === 0) clearValidate(Fields.PASSWORD);
        else validate[Fields.PASSWORD].errors.push(...error);

        return validate[Fields.PASSWORD].errors;
    };

    const cofirmPassword = (currentInput: string) => {
        validate[Fields.CONFIRM_PASSWORD].input = currentInput;
        const error = [];

        clearValidate(Fields.CONFIRM_PASSWORD);

        if (currentInput !== validate[Fields.PASSWORD].input) {
            error.push('This field has to be equal to the password');
        }

        if (error.length === 0) clearValidate(Fields.CONFIRM_PASSWORD);
        else validate[Fields.CONFIRM_PASSWORD].errors.push(...error);

        return validate[Fields.CONFIRM_PASSWORD].errors;
    };

    const clearValidate = (KeyToCheck: ValidateObjectKeyTypes) => {
        while (validate[KeyToCheck].errors.length > 0) {
            validate[KeyToCheck].errors.pop();
        }
    };

    return {
        validateUsername,
        validatePassword,
        clearValidate,
        cofirmPassword,
        validate,
    };
}

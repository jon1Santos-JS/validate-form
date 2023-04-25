export interface Validate {
    username?: { input: string; errors: string[]; isEmpty: boolean };
    password?: { input: string; errors: string[]; isEmpty: boolean };
    confirmPassword?: { input: string; errors: string[]; isEmpty: boolean };
}

export type ValidateObjectKeyTypes =
    | 'username'
    | 'password'
    | 'confirmPassword';

export enum Fields {
    USERNAME = 'username',
    PASSWORD = 'password',
    CONFIRM_PASSWORD = 'confirmPassword',
}

export default function useValidate(field: Validate) {
    const validateUsername = (currentInput: string) => {
        if (!field[Fields.USERNAME]) return;
        field[Fields.USERNAME].input = currentInput;
        field[Fields.USERNAME].isEmpty = false;

        while (field[Fields.USERNAME].errors.length > 0) {
            field[Fields.USERNAME].errors.pop();
        }

        const error: string[] = [];

        if (!currentInput.match(/.{6,}/)) {
            error.push('Username must has 6 characters at least');
        }

        if (error.length === 0) {
            while (field[Fields.USERNAME].errors.length > 0) {
                field[Fields.USERNAME].errors.pop();
            }
        } else field[Fields.USERNAME].errors.push(...error);

        return field[Fields.USERNAME].errors;
    };

    const validatePassword = (currentInput: string) => {
        if (!field[Fields.PASSWORD]) return;
        field[Fields.PASSWORD].input = currentInput;
        field[Fields.PASSWORD].isEmpty = false;

        const error = [];

        while (field[Fields.PASSWORD].errors.length > 0) {
            field[Fields.PASSWORD].errors.pop();
        }

        if (!currentInput.match(/.{6,}/)) {
            error.push('Password must has 6 characters at least');
        }

        if (error.length === 0) {
            while (field[Fields.PASSWORD].errors.length > 0) {
                field[Fields.PASSWORD].errors.pop();
            }
        } else field[Fields.PASSWORD].errors.push(...error);

        return field[Fields.PASSWORD].errors;
    };

    const cofirmPassword = (currentInput: string) => {
        if (!field[Fields.CONFIRM_PASSWORD]) return;
        field[Fields.CONFIRM_PASSWORD].input = currentInput;
        field[Fields.CONFIRM_PASSWORD].isEmpty = false;

        const error = [];

        while (field[Fields.CONFIRM_PASSWORD].errors.length > 0) {
            field[Fields.CONFIRM_PASSWORD].errors.pop();
        }

        if (!field[Fields.PASSWORD]) return;
        if (currentInput !== field[Fields.PASSWORD].input) {
            error.push('This field has to be equal to the password');
        }

        if (error.length === 0) {
            while (field[Fields.CONFIRM_PASSWORD].errors.length > 0) {
                field[Fields.CONFIRM_PASSWORD].errors.pop();
            }
        } else field[Fields.CONFIRM_PASSWORD].errors.push(...error);

        return field[Fields.CONFIRM_PASSWORD].errors;
    };

    return {
        validateUsername,
        validatePassword,
        cofirmPassword,
    };
}

export interface Validate {
    username: string[];
    password: string[];
}

export type ValidateObjectKeyTypes = 'username' | 'password';

enum Fields {
    USERNAME = 'username',
    PASSWORD = 'password',
}

export default function useValidate() {
    const validate: Validate = {
        username: [],
        password: [],
    };

    const validateUsername = (e: string) => {
        const error: string[] = [];
        clearValidate(Fields.USERNAME);

        if (!e.match(/.{6,}/)) {
            error.push('Username must has 6 characters at least');
        }

        if (error.length === 0) clearValidate(Fields.USERNAME);
        else validate[Fields.USERNAME].push(...error);

        return error;
    };

    const validatePassword = (e: string) => {
        const error = [];
        clearValidate(Fields.PASSWORD);

        if (!e.match(/.{6,}/)) {
            error.push('Password must has 6 characters at least');
        }

        if (error.length === 0) clearValidate(Fields.PASSWORD);
        else validate[Fields.PASSWORD].push(...error);

        return error;
    };

    const clearValidate = (KeyToCheck: ValidateObjectKeyTypes) => {
        while (validate[KeyToCheck].length > 0) {
            validate[KeyToCheck].pop();
        }
    };

    return { validateUsername, validatePassword, clearValidate, validate };
}

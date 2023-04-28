declare type ValidateObjectKeyTypes =
    | 'username'
    | 'password'
    | 'confirmPassword';

declare interface Validate {
    username?: InputType;
    password?: InputType;
    confirmPassword?: InputType;
}

declare interface InputType {
    value: string;
    isEmpty: boolean;
    errors: string[];
    validations: Validation[];
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}

declare type ValidateObjectKeyTypes =
    | 'username'
    | 'password'
    | 'confirmPassword';

declare interface InputsType {
    [key: string]: InputPropsType;
}

declare interface InputPropsType {
    isEmpty: boolean;
    errors: string[];
    value?: string;
    validations?: Validation[];
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}

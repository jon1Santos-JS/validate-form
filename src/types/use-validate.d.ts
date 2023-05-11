declare interface FormInputsType {
    [key: string]: InputPropsType;
}

declare interface FormInputPropsType {
    isEmpty: boolean;
    errors: string[];
    value?: string;
    validations?: Validation[];
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}

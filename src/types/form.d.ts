declare interface FormInputsType {
    [key: string]: FormInputPropsType;
}

declare interface FormInputTypeWithAuniqueProp {
    [key: string]: { value?: string };
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

declare interface onChangeInputsValueProp {
    objectifiedName: string;
    value: string;
}

declare interface onChangeInputsProps<T> {
    objectifiedName: string;
    targetProp: TargetPropsType;
    value: T;
}

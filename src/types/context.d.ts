declare interface onChangeInputsProps<T, U extends string> {
    objectifiedName: U;
    targetProp: TargetPropsType;
    value: T;
}

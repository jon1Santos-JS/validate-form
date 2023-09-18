export function onAddProps<T extends object, U extends string, I>(
    obj: T,
    prop: U,
    value: I,
) {
    const newObj = { ...obj, [prop]: value };
    return newObj;
}

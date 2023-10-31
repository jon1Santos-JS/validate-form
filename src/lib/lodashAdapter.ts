import { omit, deburr } from 'lodash';

export function onOmitProps<
    O extends object,
    U extends keyof O,
    T extends keyof O & string,
>(obj: O, propsToOmit: U[]) {
    const handledObj: unknown = omit(obj, propsToOmit);
    return handledObj as InputsToValidateType<Exclude<T, U>>;
}

export function onConverToBasicLatinLetters(word: string) {
    const handledWord = deburr(word);
    return handledWord;
}

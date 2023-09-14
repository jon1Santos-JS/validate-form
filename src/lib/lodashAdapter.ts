import { omit, deburr } from 'lodash';

export function onOmitProps<T extends object, U extends keyof T>(
    obj: T,
    propsToOmit: U[],
) {
    const handledObj: unknown = omit(obj, propsToOmit);
    return handledObj as Omit<T, U>;
}

export function onConverToBasicLatinLetters(word: string) {
    const handledWord = deburr(word);
    return handledWord;
}

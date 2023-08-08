export function onCreateID(userAccount: UserFromClientType, currentID: number) {
    const inputWithID = {
        ID: currentID + 1,
        ...userAccount,
    };
    return inputWithID;
}

export function onCreateConstraint(
    userAccount: UserFromClientType,
    constraint: ConstraintsType,
) {
    const userWithConstraint = { constraint: constraint, ...userAccount };
    return userWithConstraint;
}

export function onCreateUserImg(userAccount: UserFromClientType) {
    const userWithImg = {
        ...userAccount,
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
    };
    return userWithImg;
}

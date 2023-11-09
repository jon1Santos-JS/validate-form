import { DATABASE } from '@/database/DBHandler/DBState';

export function onAddInputFields(userAccount: UserFromClient) {
    const handledUserAccount = {
        ID: DATABASE.state.accounts.length.toString(),
        constraint: 'user',
        ...userAccount,
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
    };
    return handledUserAccount as UserFromDataBase;
}

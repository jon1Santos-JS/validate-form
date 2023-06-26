import { onCreateConstraint, onCreateID } from '@/lib/inputHandler';
import { DATABASE, SERVER_ERROR_RESPONSE } from './miniDB';
import { MiniDBHandler } from './miniDBHandler';

export class MiniDBAccountHandler {
    #DB = new MiniDBHandler();

    async signIn(userAccount: UserFromClientType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (!this.#authSignInAccount(userAccount)) {
            console.log('account was not found');
            return SERVER_ERROR_RESPONSE;
        }
        console.log(userAccount);
        return userAccount;
    }

    async signUp(userAccount: UserFromClientType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (this.#authSignUpccount(userAccount)) {
            console.log('account already exist');
            return SERVER_ERROR_RESPONSE;
        }
        const response = await this.#createAccount(userAccount);
        if (!response) {
            console.log(`user: ${userAccount.username.value} has been created`);
            return;
        }
        return SERVER_ERROR_RESPONSE;
    }

    async updatePassword(userAccount: UserToChangePasswordFromClientType) {
        const currentUserAccount = {
            username: { value: userAccount.username.value },
            password: { value: userAccount.password.value },
        };
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (!this.#authSignInAccount(currentUserAccount))
            return SERVER_ERROR_RESPONSE;
        const response = await this.#changePassword(
            currentUserAccount,
            userAccount.newPassword.value,
        );
        if (!response) {
            console.log(`user: ${userAccount.username.value} has been changed`);
            return;
        }
        return SERVER_ERROR_RESPONSE;
    }

    async #onInitDB() {
        try {
            await this.#DB.init();
            return;
        } catch {
            return SERVER_ERROR_RESPONSE;
        }
    }

    // DONT NEED 'TO REFRESH DB (async)' WHEN THE 'INIT FUNCTION' HAVE BEEN CALLED BY PUBLIC FUNCTIONS
    #authSignInAccount(userAccount: UserFromClientType) {
        const account = DATABASE.state.accounts.find((DBAccount) => {
            if (
                DBAccount.username.value !== userAccount.username.value ||
                DBAccount.password.value !== userAccount.password.value
            ) {
                return;
            }
            return DBAccount;
        });
        return account;
    }

    #authSignUpccount(userAccount: UserFromClientType) {
        const account = DATABASE.state.accounts.find((DBAccount) => {
            if (DBAccount.username.value !== userAccount.username.value) {
                return;
            }
            return DBAccount;
        });
        return account;
    }

    async #changePassword(
        userAccount: UserFromClientType,
        newPassword: string,
    ) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((account) => {
            if (
                account.username.value === userAccount.username.value &&
                account.password.value === userAccount.password.value
            ) {
                return {
                    ID: account.ID,
                    constraint: account.constraint,
                    username: { value: userAccount.username.value },
                    password: { value: newPassword },
                };
            }
            return account;
        });
        const handleResponse = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountHandler - changePassword',
        );
        if (!handleResponse) return;
        return SERVER_ERROR_RESPONSE;
    }

    async #createAccount(userAccount: UserFromClientType) {
        const userAccountHandled: UserFromDataBaseType =
            this.#onHandleInputs(userAccount);
        DATABASE.state.accounts.push(userAccountHandled);
        const response = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountHandler - createAccount',
        );
        if (!response) return;
        return SERVER_ERROR_RESPONSE;
    }

    #onHandleInputs(userAccount: UserFromClientType) {
        const accountWithConstraint = onCreateConstraint(userAccount, 'user');
        const accountWithID = onCreateID(
            accountWithConstraint,
            DATABASE.state.accounts.length,
        );
        return accountWithID as UserFromDataBaseType;
    }
}

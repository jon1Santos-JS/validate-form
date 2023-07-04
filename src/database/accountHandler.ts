import { onCreateConstraint, onCreateID } from '@/lib/inputHandler';
import { DATABASE, SERVER_ERROR_RESPONSE } from './miniDB';
import { MiniDBHandler } from './miniDBHandler';

export class MiniDBAccountHandler {
    #DB = new MiniDBHandler();

    async signIn(userAccount: AccountFromClientType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (!this.#authAccount(userAccount)) {
            console.log('account was not found');
            return SERVER_ERROR_RESPONSE;
        }
        console.log(userAccount);
        return userAccount;
    }

    async signUp(userAccount: AccountFromClientType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (this.#authUsername(userAccount.username.value)) {
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

    async updatePassword(userAccount: ChangePasswordFromClientType) {
        const currentUserAccount = {
            username: { value: userAccount.username.value },
            password: { value: userAccount.password.value },
        };
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (!this.#authAccount(currentUserAccount))
            return SERVER_ERROR_RESPONSE;
        const response = await this.#changePassword(userAccount);
        if (!response) {
            console.log(`user: ${userAccount.username.value} has been changed`);
            return;
        }
        return SERVER_ERROR_RESPONSE;
    }

    async updateUsername(user: ChangeUsernameFromClientType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        const hasUsername = this.#authUsername(user.newUsername.value);
        const currentUserAccount = this.#authUsername(user.username.value);
        if (hasUsername || !currentUserAccount) return SERVER_ERROR_RESPONSE;
        const response = await this.#changeUsername(user);
        const newUserAccount = {
            username: user.newUsername,
            password: currentUserAccount.password,
        };
        if (!response) {
            console.log(
                `user: ${currentUserAccount.username.value} has been changed to ${newUserAccount.username.value}`,
            );
            return newUserAccount;
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
    #authAccount(userAccount: AccountFromClientType) {
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

    #authUsername(username: string) {
        const account = DATABASE.state.accounts.find((DBAccount) => {
            if (DBAccount.username.value !== username) {
                return;
            }
            return DBAccount;
        });
        return account;
    }

    async #changePassword(userAccount: ChangePasswordFromClientType) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((account) => {
            if (
                account.username.value === userAccount.username.value &&
                account.password.value === userAccount.password.value
            ) {
                return {
                    ID: account.ID,
                    constraint: account.constraint,
                    username: { value: userAccount.username.value },
                    password: { value: userAccount.newPassword.value },
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

    async #changeUsername(user: ChangeUsernameFromClientType) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((account) => {
            if (account.username.value === user.username.value) {
                return {
                    ID: account.ID,
                    constraint: account.constraint,
                    username: { value: user.newUsername.value },
                    password: { value: account.password.value },
                };
            }
            return account;
        });
        const handleResponse = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountHandler - changeUsername',
        );
        if (!handleResponse) return;
        return SERVER_ERROR_RESPONSE;
    }

    async #createAccount(userAccount: AccountFromClientType) {
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

    #onHandleInputs(userAccount: AccountFromClientType) {
        const accountWithConstraint = onCreateConstraint(userAccount, 'user');
        const accountWithID = onCreateID(
            accountWithConstraint,
            DATABASE.state.accounts.length,
        );
        return accountWithID as UserFromDataBaseType;
    }
}

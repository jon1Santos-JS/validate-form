import { DATABASE, SERVER_ERROR_RESPONSE } from './miniDB';
import MiniDBHandler from './miniDBHandler';

export default class MiniDBAccountHandler {
    #DB = new MiniDBHandler();

    async signIn(userAccount: UserFromClientType) {
        if (await this.#onInitDB('sign in user')) return SERVER_ERROR_RESPONSE;
        if (!this.#authAccount(userAccount)) {
            console.log('account was not found');
            return SERVER_ERROR_RESPONSE;
        }
        console.log(userAccount);
        return userAccount;
    }

    async signUp(userAccount: UserFromClientType) {
        if (await this.#onInitDB('sign up user')) return SERVER_ERROR_RESPONSE;
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
        if (await this.#onInitDB('update password'))
            return SERVER_ERROR_RESPONSE;
        const currentUserAccount = {
            username: { value: userAccount.username.value },
            password: { value: userAccount.password.value },
        };
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
        if (await this.#onInitDB('update username'))
            return SERVER_ERROR_RESPONSE;
        const hasUsername = this.#authUsername(user.newUsername.value);
        const currentUserAccount = this.#authUsername(user.username.value);
        if (hasUsername) return SERVER_ERROR_RESPONSE;
        if (!currentUserAccount) {
            console.log('error to get the user account by: updateUsername');
            return SERVER_ERROR_RESPONSE;
        }
        const response = await this.#changeUsername(user);
        const newUserAccount = {
            username: { value: user.newUsername.value },
            password: { value: currentUserAccount.password.value },
        };
        if (!response) {
            console.log(
                `user: ${currentUserAccount.username.value} has been changed to ${newUserAccount.username.value}`,
            );
            return newUserAccount;
        }
        return SERVER_ERROR_RESPONSE;
    }

    async updateUserImage({ userName, userImg }: UserWithImgType) {
        if (await this.#onInitDB('update user image'))
            return SERVER_ERROR_RESPONSE;
        const currentUserAccount = this.#authUsername(userName);
        if (!currentUserAccount) return SERVER_ERROR_RESPONSE;
        const response = await this.#changeUserImg({ userName, userImg });
        if (!response) {
            console.log('User image has been updated');
            return;
        }
        return SERVER_ERROR_RESPONSE;
    }

    async excludeUserAccount(username: string) {
        if (await this.#onInitDB('delete account'))
            return SERVER_ERROR_RESPONSE;
        const response = await this.#deleteAccount(username);
        if (!response) {
            console.log('User account has been deleted');
            return;
        }
        return SERVER_ERROR_RESPONSE;
    }

    async #onInitDB(caller: string) {
        try {
            await this.#DB.init(caller);
            return;
        } catch {
            return SERVER_ERROR_RESPONSE;
        }
    }

    // DONT NEED 'TO REFRESH DB (async)' WHEN THE 'INIT FUNCTION' HAVE BEEN CALLED BY PUBLIC FUNCTIONS
    #authAccount(userAccount: UserFromClientType) {
        const account = DATABASE.state.accounts.find((DBAccount) =>
            DBAccount.username.value !== userAccount.username.value ||
            DBAccount.password.value !== userAccount.password.value
                ? undefined
                : DBAccount,
        );
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
        DATABASE.state.accounts = DATABASE.state.accounts.map((account) =>
            account.username.value === userAccount.username.value &&
            account.password.value === userAccount.password.value
                ? {
                      ...account,
                      password: { value: userAccount.newPassword.value },
                  }
                : account,
        );
        const handleResponse = await this.#DB.handleDB('createAndRefreshDB')(
            'MiniDBAccountHandler - changePassword',
        );
        if (!handleResponse) return;
        return SERVER_ERROR_RESPONSE;
    }

    async #changeUsername(user: ChangeUsernameFromClientType) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((account) =>
            account.username.value === user.username.value
                ? { ...account, username: { value: user.newUsername.value } }
                : account,
        );
        const handleResponse = await this.#DB.handleDB('createAndRefreshDB')(
            'MiniDBAccountHandler - changeUsername',
        );
        if (!handleResponse) return;
        return SERVER_ERROR_RESPONSE;
    }

    async #createAccount(userAccount: UserFromClientType) {
        const DBstateResponse = await this.#DB.handleDB('checkDBState')(
            'MiniDBAccountHandler - createAccount',
        );
        if (DBstateResponse) return SERVER_ERROR_RESPONSE;

        const userAccountHandled: UserFromDataBaseType =
            this.#onHandleInputs(userAccount);
        DATABASE.state.accounts.push(userAccountHandled);
        const response = await this.#DB.handleDB('createAndRefreshDB')(
            'MiniDBAccountHandler - createAccount',
        );

        if (!response) return;
        return SERVER_ERROR_RESPONSE;
    }

    async #changeUserImg({ userName, userImg }: UserWithImgType) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((account) =>
            account.username.value === userName
                ? { ...account, userImage: userImg }
                : account,
        );
        const response = await this.#DB.handleDB('createAndRefreshDB')(
            'MiniDBAccountHandler - changeUserImg',
        );
        if (!response) return;
        return SERVER_ERROR_RESPONSE;
    }

    async #deleteAccount(username: string) {
        DATABASE.state.accounts = DATABASE.state.accounts.filter(
            (account) => account.username.value !== username,
        );
        const response = await this.#DB.handleDB('createAndRefreshDB')(
            'MiniDBAccountHandler - deleteUserAccount',
        );
        if (!response) return;
        return SERVER_ERROR_RESPONSE;
    }

    #onHandleInputs(userAccount: UserFromClientType) {
        const handledUserAccount = {
            ID: DATABASE.state.accounts.length.toString(),
            constraint: 'user',
            ...userAccount,
            userImage: process.env
                .NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        };
        return handledUserAccount as UserFromDataBaseType;
    }
}

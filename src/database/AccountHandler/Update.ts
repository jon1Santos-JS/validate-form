import { DATABASE } from '../DBState';
import DBHandler from '../DBhandler';
import UserAuth from './Auth';

export default class UpdateHandler {
    #AUTH = new UserAuth();
    #DB = new DBHandler();

    async updateUsername(
        userAccount: UserFromClient,
        newUsername: NewUsernameFromClient,
    ) {
        const authResponse = await this.#AUTH.authUsername({
            ...userAccount,
            username: newUsername,
        });
        if (authResponse)
            return {
                success: false,
                data: 'Username already exist',
            } as DBResponse;
        const response = await this.#updateUsername(userAccount, newUsername);
        return response;
    }

    async #updateUsername(
        userAccount: UserFromClient,
        newUsername: NewUsernameFromClient,
    ) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value
                ? { ...DBAccount, username: newUsername }
                : DBAccount,
        );
        const response = await this.#DB.handleDB(
            'refreshDB',
            'change username',
        );
        if (!response.success) return response as DBResponse;
        console.log(
            `user: ${userAccount.username.value} has been changed to ${newUsername.value}`,
        );
        return {
            success: true,
            data: 'Username has been changed',
        } as DBResponse;
    }

    async updatePassword(
        userAccount: UserFromClient,
        newPassword: NewPasswordFromClient,
    ) {
        const authResponse = await this.#AUTH.authAccount(userAccount);
        if (!authResponse.success) return authResponse;
        const response = await this.#updatePassword(userAccount, newPassword);
        return response;
    }

    async #updatePassword(
        userAccount: UserFromClient,
        newPassword: NewPasswordFromClient,
    ) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value &&
            DBAccount.password.value === userAccount.password.value
                ? {
                      ...DBAccount,
                      password: newPassword,
                  }
                : DBAccount,
        );
        const response = await this.#DB.handleDB(
            'refreshDB',
            'change password',
        );
        if (!response.success) return response;
        console.log('User password has been changed');
        return {
            success: true,
            data: 'User password has been changed',
        } as DBResponse;
    }

    async updateUserImage(
        userAccount: UserFromClient,
        newUserImage: NewUserImage,
    ) {
        const authResponse = await this.#AUTH.authUsername(userAccount);
        if (!authResponse) return authResponse;
        const response = await this.#updateUserImage(userAccount, newUserImage);
        return response;
    }

    async #updateUserImage(
        userAccount: UserFromClient,
        newUserImage: NewUserImage,
    ) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value
                ? { ...DBAccount, userImage: newUserImage.value }
                : DBAccount,
        );
        const response = await this.#DB.handleDB(
            'refreshDB',
            'change user image',
        );
        if (!response.success) return response;
        console.log('User image has been changed');
        return {
            success: true,
            data: 'User image has been changed',
        } as DBResponse;
    }
}

import { DATABASE } from '../DBState';

export default class UserUpdateHandler {
    async updateUsername(
        userAccount: UserFromClient,
        newUsername: NewUsernameFromClient,
    ) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value
                ? { ...DBAccount, username: newUsername }
                : DBAccount,
        );
        console.log(
            `user: ${userAccount.username.value} has been changed to ${newUsername.value}`,
        );
        return {
            success: true,
            data: 'Username has been changed',
        } as DBDefaultResponse;
    }

    async updatePassword(
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

        console.log('User password has been changed');
        return {
            success: true,
            data: 'User password has been changed',
        } as DBDefaultResponse;
    }

    async updateUserImage(
        userAccount: UserFromClient,
        newUserImage: NewUserImage,
    ) {
        DATABASE.state.accounts = DATABASE.state.accounts.map((DBAccount) =>
            DBAccount.username.value === userAccount.username.value
                ? { ...DBAccount, userImage: newUserImage.value }
                : DBAccount,
        );

        console.log('User image has been changed');
        return {
            success: true,
            data: 'User image has been changed',
        } as DBDefaultResponse;
    }
}

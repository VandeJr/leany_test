export class ProfileModel {
    firstName: string;
    lastName: string;
    address?: string;

    constructor(firstName: string, lastName: string, address?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
    }
}

export class UserModel {
    id: string;
    email: string;
    password?: string;
    isActive: boolean;
    createdAt: Date;
    profile?: ProfileModel;

    constructor(
        id: string,
        email: string,
        isActive: boolean,
        createdAt: Date,
        password?: string,
        profile?: ProfileModel,
    ) {
        this.id = id;
        this.email = email;
        this.isActive = isActive;
        this.createdAt = createdAt;
        if (password) this.password = password;
        if (profile) this.profile = profile;
    }
}

import { User } from "../../entity/User";

export interface PublicUser {
    id: number;
    username: string;
    role: string;
    avatar?: string | null;
    mustSetNewPassword: boolean;
}

export function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        mustSetNewPassword: user.mustSetNewPassword,
    };
}

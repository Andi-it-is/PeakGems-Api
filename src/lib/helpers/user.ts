import { User } from "../../entity/User";

export interface PublicUser {
    id: number;
    username: string;
    role: string;
}

export function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        username: user.username,
        role: user.role,
    };
}

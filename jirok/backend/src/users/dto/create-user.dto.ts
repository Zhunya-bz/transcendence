export class CreateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    surname?: string;
    jobTitle?: string;
    jobOrganization?: string;
    location?: string;
    avatarUrl?: string;
}

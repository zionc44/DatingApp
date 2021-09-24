import { User } from "./user.model";

export class UserParams {
    public gender: string;
    public minAge: number = 18;
    public maxAge: number = 99;
    public orderBy: string = 'lastActie';
    public pageSize: number = 5;
    public pageNumber: number = 1;
    public predicate: string = "liked";
    public container: string = "Unread";

    constructor(public user: User) {
        this.gender = user.gender === "female" ? "male" : "female";
    }
}
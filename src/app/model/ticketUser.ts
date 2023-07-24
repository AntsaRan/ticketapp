import { Ticket } from "../../interfaces/ticket.interface"
import { User } from "../../interfaces/user.interface"

export class TicketUser{
    id: number;
    completed: boolean;
    user:User;
    description: string;


    constructor(id: number, completed: boolean, user: User, description: string) {
        this.id = id;
        this.user = user;
        this.completed = completed;
        this.description = description;
    }
}
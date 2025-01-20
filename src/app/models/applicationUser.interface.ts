import { Badge } from "./badge.interface";

export interface ApplicationUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    profilePictureUrl?:string;
    role?: string;
    badges?: Badge[];
    about?: string;
    isSubscribedToNewsletter?: boolean;
  }
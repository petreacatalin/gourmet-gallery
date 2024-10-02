export interface ApplicationUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    profilePictureUrl?:string;
    role?: string;
  }
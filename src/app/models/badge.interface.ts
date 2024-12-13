
export interface Badge {
    id: number;
    name: string;
    description: string;
    iconUrl: string;  // URL to the badge icon image
    points: number;
    isActive?: boolean;
    condition: number;
  }
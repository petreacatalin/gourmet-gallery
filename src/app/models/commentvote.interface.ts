export interface CommentVote {
    id?: number;
    commentId: number;
    userId: string; 
    isHelpful: boolean; 
  }
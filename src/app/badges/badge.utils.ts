export const BadgeConditionDescriptions: { [key: string]: string } = {
    FirstRecipePosted: 'First Recipe Posted',
    FiveRecipesPosted: 'Posted Five Recipes',
    FiftyLikesOnComments: 'Earned 50 Likes on Comments'
  };
  
  export function getBadgeConditionDescription(condition: string): string {
    return BadgeConditionDescriptions[condition] || 'Unknown Condition';
  }
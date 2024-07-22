import { Step } from "./step.interface";

export interface Instructions {
  id: number;
  steps: Step[];
  recipeId: number;
}

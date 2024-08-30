import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { Ingredient } from 'src/app/models/ingredient.interface';
import { Step } from 'src/app/models/step.interface';
import { MealType, Cuisine, DietaryRestrictions, CookingMethod, MainIngredient, Occasion, DifficultyLevel  } from 'src/app/utils/enums';
import { AuthService } from 'src/app/auth/auth.service';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { Observable, map, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-recipe-add-edit',
  templateUrl: './recipe-add-edit.component.html',
  styleUrls: ['./recipe-add-edit.component.scss']
})
export class RecipeAddEditComponent implements OnInit {
  recipeForm!: FormGroup;
  mealTypes = Object.keys(MealType).filter(key => isNaN(Number(key)));
  cuisines = Object.keys(Cuisine).filter(key => isNaN(Number(key)));
  dietaryRestrictions = Object.keys(DietaryRestrictions).filter(key => isNaN(Number(key)));
  cookingMethods = Object.keys(CookingMethod).filter(key => isNaN(Number(key)));
  mainIngredients = Object.keys(MainIngredient).filter(key => isNaN(Number(key)));
  occasions = Object.keys(Occasion).filter(key => isNaN(Number(key)));
  difficultyLevels = Object.keys(DifficultyLevel).filter(key => isNaN(Number(key)));
  //otherCategories = Object.keys(OtherCategories).filter(key => isNaN(Number(key)));
  selectedFile: File | null = null;
  newImageUrl: string | ArrayBuffer | null = null;
  urlPhoto: string | null = null;

  isEditMode = false;
  recipeId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private spinnerService: SpinnerService,

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  initializeForm(): void {
    this.recipeForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        ingredientsTotal: this.formBuilder.group({
            id: [0],
            ingredients: this.formBuilder.array([]),
            recipeId: [0]
        }),
        instructions: this.formBuilder.group({
            id: [0],
            steps: this.formBuilder.array([]),
            recipeId: [0]
        }),
        tags: [''],
        mealType: [null],
        cuisine: [null],
        dietaryRestrictions: [null],
        cookingMethod: [null],
        mainIngredient: [null],
        occasion: [null],
        difficultyLevel: [null],
        //otherCategories: [null],
        informationTime: this.formBuilder.group({
            prepTime: [null],
            cookTime: [null],
            standTime: [null],
            totalTime: [null],
            servings: [null]
        }),
        nutritionFacts: this.formBuilder.group({
            calories: [null],
            fat: [null],
            carbs: [null],
            protein: [null]
        })
    });

    this.addIngredient(); // Add an initial ingredient
    this.addStep(); // Add an initial step
}

  createIngredient(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  createStep(stepNumber: number): FormGroup {
    return this.formBuilder.group({
      stepNumber: [stepNumber, Validators.required],
      description: ['', Validators.required]
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredientsTotal.ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('instructions.steps') as FormArray;
  }

addIngredient() {
    this.ingredients.push(this.createIngredient());
    this.animateAddition('ingredient');
  }

  removeIngredient(index: number) {
    this.animateRemoval('ingredient', index);
    setTimeout(() => this.ingredients.removeAt(index), 500); // Delay removal to allow fade-out
  }

  addStep() {
    const stepNumber = this.steps.length + 1;
    this.steps.push(this.createStep(stepNumber));
    this.animateAddition('step');
  }

  removeStep(index: number) {
    this.animateRemoval('step', index);
    setTimeout(() => this.steps.removeAt(index), 500); // Delay removal to allow fade-out
    this.updateStepNumbers(); // Update step numbers after removal
  }

  updateStepNumbers(): void {
    this.steps.controls.forEach((step, index) => {
      step.patchValue({ stepNumber: index + 1 });
    });
  }

   animateAddition(type: string) {
    const container = document.querySelector(`.container-${type}`);
    if (container) {
      container.classList.add('fade-in');
      setTimeout(() => container.classList.remove('fade-in'), 500); // Remove class after animation
    }
  }

  animateRemoval(type: string, index: number) {
    const element = document.querySelector(`.container-${type}-${index}`);
    if (element) {
      element.classList.add('fade-out');
      setTimeout(() => element.classList.remove('fade-out'), 500); // Remove class after animation
    }
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = +params['id'];
        this.recipeService.getRecipeById(this.recipeId).subscribe(
          (recipe: Recipe) => {
            this.recipeForm.patchValue({
              title: recipe.title,
              description: recipe.description,
              tags: recipe.tags,
              mealType: recipe.mealType,
              cuisine: recipe.cuisine,
              dietaryRestrictions: recipe.dietaryRestrictions,
              cookingMethod: recipe.cookingMethod,
              mainIngredient: recipe.mainIngredient,
              occasion: recipe.occasion,
              difficultyLevel: recipe.difficultyLevel,
              //otherCategories: recipe.otherCategories
            });

            const ingredientsArray = this.ingredients;
            recipe.ingredientsTotal.ingredients.forEach((ingredient: Ingredient) => {
              ingredientsArray.push(this.formBuilder.group(ingredient));
            });

            const stepsArray = this.steps;
            recipe.instructions.steps.forEach((step: Step) => {
              stepsArray.push(this.formBuilder.group(step));
            });
          },
          (error) => {
            console.error('Error fetching recipe:', error);
            // Optionally show user feedback here
          }
        );
      }
    });
  }

  onSubmit(): void {
    this.spinnerService.show();

    if (this.recipeForm.invalid) {
        this.spinnerService.hide();
        return;
    }

    const recipe: Recipe = this.recipeForm.value;
    if (this.isEditMode && this.recipeId) {
        recipe.id = this.recipeId;
        this.updateRecipe(recipe);
        this.spinnerService.hide();
    } else {
        if (this.recipeForm.valid && this.selectedFile) {
            this.uploadImage(this.selectedFile!).subscribe(
                (urlRecipePhoto) => {
                    this.urlPhoto = urlRecipePhoto;

                    // Once the image upload is successful, set the imageUrl and create the recipe
                    recipe.imageUrl = this.urlPhoto;
                    this.createRecipe(recipe);
                    this.spinnerService.hide();

                },
                (error) => {
                    console.error('Error uploading image:', error);
                    this.spinnerService.hide();
                }
            );
        } else {
            this.createRecipe(recipe);
            this.spinnerService.hide();
        }
    }
}

uploadImage(file: File): Observable<string> {
  
    return this.recipeService.uploadImage(file).pipe(
        map((response: any) => response), // Ensure the response is treated as text
        catchError((error: any) => {
            console.error('Error uploading image:', error);
            return throwError(error);
        })
    );
}

createRecipe(recipe: Recipe): void {
    this.recipeService.createRecipe(recipe).subscribe(
        (createdRecipe) => {
            this.router.navigate(['/recipes/list']);
        },
        (error) => {
            console.error('Error creating recipe:', error);
        }
    );
}

  updateRecipe(recipe: Recipe): void {
    this.recipeService.updateRecipe(recipe).subscribe(
      (updatedRecipe) => {
        this.router.navigate(['/recipes/list']);
      },
      (error) => {
        console.error('Error updating recipe:', error);
        // Optionally show user feedback here
      }
    );
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.newImageUrl = reader.result; // Show a preview of the image
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    this.spinnerService.show();  
    if (this.selectedFile) {      
      this.selectedFile = null;
      this.newImageUrl = null;
    }
  }

  removeSelectedfile(): void{
    this.selectedFile = null;
    this.newImageUrl = null;
  }
   

}

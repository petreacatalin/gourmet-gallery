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
import { Observable, map, catchError, throwError, startWith } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { Category } from 'src/app/models/category.interface';

@Component({
  selector: 'app-recipe-add-edit',
  templateUrl: './recipe-add-edit.component.html',
  styleUrls: ['./recipe-add-edit.component.scss']
})
export class RecipeAddEditComponent implements OnInit {
  recipeForm!: FormGroup;
  // mealTypes = Object.keys(MealType).filter(key => isNaN(Number(key)));
  // cuisines = Object.keys(Cuisine).filter(key => isNaN(Number(key)));
  // dietaryRestrictions = Object.keys(DietaryRestrictions).filter(key => isNaN(Number(key)));
  // cookingMethods = Object.keys(CookingMethod).filter(key => isNaN(Number(key)));
  // mainIngredients = Object.keys(MainIngredient).filter(key => isNaN(Number(key)));
  // occasions = Object.keys(Occasion).filter(key => isNaN(Number(key)));
  // difficultyLevels = Object.keys(DifficultyLevel).filter(key => isNaN(Number(key)));
  //otherCategories = Object.keys(OtherCategories).filter(key => isNaN(Number(key)));
  selectedFile: File | null = null;
  newImageUrl: string | ArrayBuffer | null = null;
  urlPhoto: string | null = null;
  categories: Category[] = []; // Store all categories
  dinners: Category[] | undefined = [] ;
  meals: Category[] | undefined = [];
  ingredient: Category[] | undefined = [];
  occasions: Category[] | undefined = [];
  cuisines: Category[]  | undefined = [];
  filteredDinners: Category[] | undefined = [];
  filteredMeals: Category[] | undefined = [];
  filteredIngredients: Category[] | undefined = [];
  filteredOccasions: Category[]  | undefined= [];
  filteredCuisines: Category[]  | undefined= [];
  recipe: Recipe | undefined; 
  isEditMode = false;
  recipeId: number | null = null;
  subcategoriesMap: { [key: string]: any[] } = {};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private categoriesService: CategoriesService,

  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCategories();
    }, 0);
    this.initializeForm();
    this.checkEditMode();
    if(this.isEditMode === false){  
      debugger
      this.addIngredient(); 
      this.addStep(); 
    }
    this.recipeForm.get('dinnerCategory')?.valueChanges
    .pipe(
      startWith(''),
      map((value) => typeof value === 'string' ? value : value.name), // Get the name if the full object is selected
      map((name) => this.filterSubcategories(this.dinners!, name || ''))
    )
    .subscribe(filtered => this.filteredDinners = filtered);

  this.recipeForm.get('mealCategory')?.valueChanges
    .pipe(
      startWith(''),
      map((value) => typeof value === 'string' ? value : value.name),
      map((name) => this.filterSubcategories(this.meals!, name || ''))
    )
    .subscribe(filtered => this.filteredMeals = filtered);

  this.recipeForm.get('ingredientCategory')?.valueChanges
    .pipe(
      startWith(''),
      map((value) => typeof value === 'string' ? value : value.name),
      map((name) => this.filterSubcategories(this.ingredient!, name || ''))
    )
    .subscribe(filtered => this.filteredIngredients = filtered);

  this.recipeForm.get('occasionCategory')?.valueChanges
    .pipe(
      startWith(''),
      map((value) => typeof value === 'string' ? value : value.name),
      map((name) => this.filterSubcategories(this.occasions!, name || ''))
    )
    .subscribe(filtered => this.filteredOccasions = filtered);

  this.recipeForm.get('cuisineCategory')?.valueChanges
    .pipe(
      startWith(''),
      map((value) => typeof value === 'string' ? value : value.name),
      map((name) => this.filterSubcategories(this.cuisines!, name || ''))
    )
    .subscribe(filtered => this.filteredCuisines = filtered);
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  initializeForm(): void {
    this.recipeForm = this.formBuilder.group({
        title: ['', [Validators.required, Validators.maxLength(70)]],
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
        dinnerCategory: [''],
        mealCategory: [''],
        ingredientCategory: [''],
        occasionCategory: [''],
        cuisineCategory: [''],
        dietaryRestrictions: [null],
        cookingMethod: [null],
        difficultyLevel: [null],
        //otherCategories: [null],
        informationTime: this.formBuilder.group({
            id:[0],
            prepTime: [null],
            cookTime: [null],
            standTime: [null],
            totalTime: [null],
            servings: [null]
        }),
        nutritionFacts: this.formBuilder.group({
            id:[0],
            calories: [null],
            fat: [null],
            carbs: [null],
            protein: [null],
            recipeId:[null],
        })
    });
 
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
        if (params['id'] && params['slug']) {
            this.isEditMode = true;
            this.recipeId = +params['id'];
            const slug = params['slug'];

            if (this.recipeId && slug) {
                this.recipeService.getRecipeByIdAndSlug(this.recipeId, slug).subscribe(
                    (recipe: Recipe) => {
                      console.log(recipe)
                      // Populate form fields with recipe data
                      this.recipeForm.patchValue({
                        title: recipe.title,
                        description: recipe.description,
                        tags: recipe.tags,
                        //dinnerCategory: recipe.dinnerCategoryId,
                        mealCategory: recipe.mealTypeId,
                        //ingredientCategory: recipe.ingredientCategoryId!,
                        occasionCategory: recipe.occasionId,
                        cuisineCategory: recipe.cuisineId,
                        dietaryRestrictions: recipe.dietaryRestrictions,
                        //cookingMethod: recipe.cookingMethod,
                        difficultyLevel: recipe.difficultyLevel,
                        // instructionsId,
                        informationTime: {
                          id: recipe.informationTime?.id!,
                          prepTime: recipe.informationTime!.prepTime,
                          cookTime: recipe.informationTime!.cookTime,
                          standTime: recipe.informationTime!.standTime,
                          totalTime: recipe.informationTime!.totalTime,
                          servings: recipe.informationTime!.servings,
                        },
                        nutritionFacts: {
                          id: recipe.nutritionFacts!.id!,
                          calories: recipe.nutritionFacts!.calories,
                          fat: recipe.nutritionFacts!.fat,
                          carbs: recipe.nutritionFacts!.carbs,
                          protein: recipe.nutritionFacts!.protein,
                          recipeId: recipe.nutritionFacts!.recipeId,
                        },
                        ingredientsTotal:{
                          id: recipe.ingredientsTotal.id,
                          recipeId: recipe.ingredientsTotal.id
                        },
                        instructions: {
                          id: recipe.instructions.id
                        },
                        
                      });
                      
                      this.recipe = recipe;
                      // Populate ingredients array
                      const ingredientsArray = this.ingredients;
                      ingredientsArray.clear(); // Clear any existing controls
                        recipe.ingredientsTotal.ingredients.forEach((ingredient: Ingredient) => {
                            ingredientsArray.push(this.formBuilder.group({
                                id: ingredient.id,
                                ingredientsTotalId: ingredient.ingredientsTotalId,
                                name: ingredient.name,
                                quantity: ingredient.quantity,
                            }));
                        });

                        // Populate steps array
                        const stepsArray = this.steps;
                        stepsArray.clear(); // Clear any existing controls
                        recipe.instructions.steps.forEach((step: Step, index: number) => {
                            stepsArray.push(this.formBuilder.group({
                                stepNumber: index + 1, // Ensure step numbers are sequential
                                description: step.description,
                            }));
                        });
                    },
                    (error) => {
                        console.error('Error fetching recipe:', error);
                    }
                );
            }
        }
    });
}


  onSubmit(): void {
    this.spinnerService.show();

    console.log(this.recipeForm.value)
    if (this.recipeForm.invalid) {
        this.spinnerService.hide();
        return;
    }

    const recipe: Recipe = this.recipeForm.value;
    const selectedSubcategories = [
      this.recipeForm.get('dinnerCategory')?.value?.id,
      this.recipeForm.get('mealCategory')?.value?.id,
      this.recipeForm.get('ingredientCategory')?.value?.id,
      this.recipeForm.get('occasionCategory')?.value?.id,
      this.recipeForm.get('cuisineCategory')?.value?.id,
    ].filter(id => id != null); // Filter out any null values
    recipe.selectedSubcategories = selectedSubcategories;
    if (this.isEditMode && this.recipeId) {
        recipe.id = this.recipeId;
        recipe.applicationUserId = this.recipe?.applicationUserId;
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

  getCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;

      this.categories.forEach(sub => {
        if (!sub.parentCategoryId) {
          switch (sub.slug) {
            case "dinners":
              this.dinners = sub.subcategories;
              break;
            case "cuisines":
              this.cuisines = sub.subcategories;
              break;
            case "meals":
              this.meals = sub.subcategories;
              break;
            case "ingredients":
              this.ingredient = sub.subcategories;
              break;
            case "occasions":
              this.occasions = sub.subcategories;
              break;
            default:
              break;
          }
        }
      });

      // Initialize filtered lists to show all options initially
      this.filteredDinners = this.dinners;
      this.filteredMeals = this.meals;
      this.filteredIngredients = this.ingredient;
      this.filteredOccasions = this.occasions;
      this.filteredCuisines = this.cuisines;
    });
  }

  private filterSubcategories(subcategories: Category[], searchText: string): any[] {
    const filterValue = searchText.toLowerCase();
    return subcategories.filter(subcategory => subcategory.name.toLowerCase().includes(filterValue));
  }

  displayCategoryName(category: any): string {
    return category ? category.name : '';
  }
}



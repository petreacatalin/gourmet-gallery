import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { CommentService } from 'src/app/comments/comments.service';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { Comments } from 'src/app/models/comments.interface';
import { __values } from 'tslib';
import { Step } from 'src/app/models/step.interface';
import { Instructions } from 'src/app/models/instructions.interface';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe?: Recipe;
  comments: Comments[] = [];
  commentForm: FormGroup;
  currentUser: ApplicationUser | null = null; 
  private routeSub: Subscription | undefined;
  private recipeSub: Subscription | undefined;
  private userSub: Subscription | undefined;
  private commentSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];
      this.recipeSub = this.recipeService.getRecipeById(id).subscribe(recipe => {
        this.recipe = recipe;

        // Mapping and processing instructions
        const instructions = this.recipe.instructions as Instructions;
        console.log('Instructions:', instructions);

        // Load comments
        this.loadComments();
      });
    });

    this.userSub = this.authService.getUserDetail().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.recipeSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.commentSub?.unsubscribe();
  }

  loadComments(): void {
    if (this.recipe) {
      this.commentSub = this.commentService.getCommentsForRecipe(this.recipe.id!).subscribe(response => {
        // Assuming response contains $values property
        this.comments = response.$values;
        
        console.log('Comments:', this.comments);
      });
    }
  }

  onSubmit(): void {
    debugger
    if (this.recipe && this.currentUser) {
      const newComment: Comments = {
        content: this.commentForm.get('content')?.value,
        applicationUserId: this.currentUser.id, // Assuming currentUser has the necessary user ID
        recipeId: this.recipe.id,
        user: this.currentUser,
        timestamp: new Date()
      };

      this.commentService.addComment(newComment).subscribe(comment => {
        this.comments.push(comment);
        this.commentForm.reset();
      });
    }
  }

  getStarClass(index: number, rating: number): string {
    return index < rating ? 'star' : 'star-empty';
  }
}
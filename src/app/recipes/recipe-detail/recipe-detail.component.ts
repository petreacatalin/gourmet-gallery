import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/comments/comments.service';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { Comments } from 'src/app/models/comments.interface';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { AuthService } from 'src/app/auth/auth.service';

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
      rating: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUserSub();
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getRecipe(id);
      this.loadComments(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.recipeSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.commentSub?.unsubscribe();
  }

  getRecipe(id: number): void {
    this.recipeSub = this.recipeService.getRecipeById(id).subscribe(recipe => {
      this.recipe = recipe as Recipe;
      console.log('recipe:', recipe);
    });
  }

  loadComments(recipeId: number): void {
    this.commentSub = this.commentService.getCommentsForRecipe(recipeId).subscribe(response => {
      this.comments = response.$values || [];
      console.log('Comments:', this.comments);
    });
  }

  getUserSub(): void {
    this.currentUser = this.authService.getUserDetail();
  }

  onSubmit(): void {
    this.getUserSub();
    if (this.recipe && this.currentUser) {
      const newComment: Comments = {
        content: this.commentForm.get('content')?.value,
        applicationUserId: this.currentUser.id,
        recipeId: this.recipe.id,
        user: this.currentUser,
        timestamp: new Date(),
        rating: this.commentForm.get('rating')?.value
      };

      this.commentService.addComment(newComment).subscribe(comment => {
        this.comments.push(comment);
        this.commentForm.reset();
      });
    }
  }
}

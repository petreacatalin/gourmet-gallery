import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { CommentService } from 'src/app/comments/comments.service';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { User } from 'src/app/models/user.interface'; // Import your User interface
import { Comments } from 'src/app/models/comments.interface';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe$: Observable<Recipe> | undefined;
  recipe: Recipe | undefined;
  comments: Comments[] = [];
  commentForm: FormGroup;
  currentUser: User | null = null; // Use User type or null
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
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.recipe$ = this.recipeService.getRecipeById(id);

    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];
      this.recipeSub = this.recipeService.getRecipeById(id).subscribe(recipe => {
        this.recipe = recipe;
        this.loadComments();
      });
    });

    this.userSub = this.authService.getUserDetail().subscribe(user => {
      this.currentUser = user;
    });
    console.log(this.currentUser)
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
        console.log('Received response:', response);
        // Extract the comments array from the response
        debugger
        this.comments = response || [];
      });
    }
  }

  onSubmit(): void {
    debugger
    console.log(this.currentUser)
    if (this.recipe && this.currentUser) {
      const newComment: Comments = {
        content: this.commentForm.get('content')?.value,
        user: this.currentUser, // Assuming currentUser has the necessary user details
        recipeId: this.recipe.id
      };

      this.commentService.addComment(newComment).subscribe(comment => {
        this.comments.push(comment);
        this.commentForm.reset();
      });
    }
  }
}

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/comments/comments.service';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { Comments } from 'src/app/models/comments.interface';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe?: Recipe;
  comments: Comments[] = [];
  commentForm: FormGroup;
  currentUser?: ApplicationUser; 
  visibleComments: any[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  commentsToShow = 7; 
  hasMoreComments = true; // Flag to check if there are more comments to load
  @ViewChildren('stepContent') stepContents!: QueryList<ElementRef>;
  currentStep: number = 0;
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
    setTimeout(() => {
      this.checkCommentsLength();
    }, 100);
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.stepContents.forEach(el => {
        // Initialize or manipulate elements if needed
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.recipeSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.commentSub?.unsubscribe();
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  getRecipe(id: number): void {
    this.recipeSub = this.recipeService.getRecipeById(id).subscribe(recipe => {
      this.recipe = recipe as Recipe;
    });
  }

  loadComments(recipeId: number): void {
    this.commentSub = this.commentService.getCommentsForRecipe(recipeId).subscribe(response => {
      this.comments = response || [];
    });  
  }

  checkCommentsLength(){
    if (this.comments.length > 0) {
      this.visibleComments = this.comments.slice(0, this.commentsToShow);
      this.hasMoreComments = this.comments.length > this.commentsToShow;
    } else {
      this.hasMoreComments = false;
    }
  }

  loadMoreComments() {
    const currentCount = this.visibleComments.length;
    const newCount = currentCount + 7; // Load more comments in chunks of 7
    this.visibleComments = this.comments.slice(0, newCount);
    this.hasMoreComments = this.comments.length > newCount;
  }
  getUserSub(): void {
    console.log(this.currentUser)

    this.currentUser = this.authService.getUserDetail()!;
    console.log(this.currentUser)
  }

  rate(star: number) {
    this.commentForm.patchValue({ rating: star });
  }

  onCommentSubmit(): void {
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
      setTimeout(() => {
        this.checkCommentsLength();
        this.loadMoreComments();
      }, 100);
    }
  }

  onScroll() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let foundStep = -1;

    this.stepContents.forEach((step, index) => {
      const rect = step.nativeElement.getBoundingClientRect();
      const stepTop = rect.top + window.scrollY;
      const stepBottom = stepTop + rect.height;
      if (scrollPosition >= stepTop && scrollPosition < stepBottom) {
        foundStep = index;
      }
    });

    this.currentStep = foundStep !== -1 ? foundStep : this.currentStep;
  }
}
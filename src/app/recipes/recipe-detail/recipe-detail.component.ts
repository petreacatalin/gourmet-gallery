import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Recipe } from 'src/app/models/recipe.interface';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Rating } from 'src/app/models/rating.interface';
import { CommentService } from 'src/app/comments/comments.service';
import { Comments } from 'src/app/models/comments.interface';
import { RecipeService } from '../recipe.service';
import { ToastService } from 'src/app/utils/toast/toast.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe?: Recipe;
  comments: Comments[] = [];
  commentForm: FormGroup;
  editForm: FormGroup | null = null;
  replyForm: FormGroup; 
  currentUser?: ApplicationUser; 
  visibleComments: Comments[] = [];  
  private confirmSubscription: Subscription | null = null;
  stars: number[] = [1, 2, 3, 4, 5];
  commentsToShow = 7; 
  hasMoreComments = true; // Flag to check if there are more comments to load
  currentStep: number = 0;
  replyingToComment: Comments | null = null;
  commentToDeleteId?: number;
  @ViewChildren('stepContent') stepContents!: QueryList<ElementRef>;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;
  private routeSub: Subscription | undefined;
  private recipeSub: Subscription | undefined;
  private userSub: Subscription | undefined;
  private commentSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
      rating: [null]
    });
    this.editForm = this.fb.group({
      content: ['', Validators.required],
      rating: [null]
    });
    this.replyForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUserSub();
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];         // Get the recipe ID
      const slug = params['slug'];      // Get the recipe slug
  
      if (id && slug) {
        this.getRecipe(id, slug);       // Pass both ID and slug
      }
  
      this.loadComments(id);
    });
  
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.recipeSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.commentSub?.unsubscribe();
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  getRecipe(id: number, slug: string): void {
    this.recipeSub = this.recipeService.getRecipeByIdAndSlug(id, slug).subscribe(recipe => {
      this.recipe = recipe as Recipe;
    });
  }
  
  triggerSuccess(text?: string): void {
    this.toastService.showToast(text!, 'success');
  }
  
  triggerError(text?: string): void {
    this.toastService.showToast(text!, 'error');
  }

  loadComments(recipeId: number): void {
    this.commentSub = this.commentService.getCommentsForRecipe(recipeId).subscribe(response => {
      this.comments = response || [];
      this.checkCommentsLength();
    });  
  }

  checkCommentsLength() {
  if (this.comments.length > 0) {
    this.visibleComments = this.comments.slice(0, this.commentsToShow);
    this.hasMoreComments = this.comments.length > this.commentsToShow;
  } else {
    this.visibleComments = []; // Ensure visibleComments is cleared if no comments
    this.hasMoreComments = false;
  }
}
  loadMoreComments(): void {
    const currentCount = this.visibleComments.length;
    const newCount = currentCount + 7; 
    
    this.checkCommentsLength();
    if (newCount >= this.comments.length) {
      this.visibleComments = this.comments.slice(0, this.comments.length);
      this.hasMoreComments = false; 
      this.triggerError("No more comments to load")
    } else {
      this.visibleComments = this.comments.slice(0, newCount);
      this.hasMoreComments = true; 
    }
  }

  getUserSub(): void {
   this.authService.loadUserDetails().subscribe((data: ApplicationUser) => {this.currentUser = data})!;
  }

  rate(star: number) {
    this.commentForm.patchValue({ rating: star });
  }

  getStarClass(star: number, ratingValue?: number): string {
    return star <= (ratingValue || 0) ? 'filled' : 'empty';
  }

  hasUserCommentedWithRating(): boolean {
    return this.comments.some(comment => comment.user?.id === this.currentUser?.id && comment.rating);
  }

  onCommentSubmit(): void {
    if (this.recipe && this.currentUser) {
      const ratingValue = this.commentForm.get('rating')?.value;
      if (ratingValue && this.hasUserCommentedWithRating()) {
        this.triggerError("Only one rating per user is allowed.")
        this.commentForm.get('rating')?.setValue(null);
        return;
      }

      const rating: Rating | null = ratingValue ? {
        ratingValue: ratingValue,
        userId: this.currentUser.id,
        recipeId: this.recipe.id,
      } : null;

      const newComment: Comments = {
        content: this.commentForm.get('content')?.value,
        applicationUserId: this.currentUser.id,
        recipeId: this.recipe.id,
        user: this.currentUser,
        timestamp: new Date(),
        rating: rating
      };

      this.commentService.addComment(newComment).subscribe(comment => {
        this.comments.push(comment);
        this.triggerSuccess("Success! Your comment has been posted !")
        this.commentForm.get('content')?.setValue(null);
        this.checkCommentsLength();
        this.loadMoreComments();
      }
      ,(error) => {
        this.triggerError("Error submitting the comment.")

    })
    
  }
  else{
    this.triggerError("You need to be logged in to submit comments.")

  }
  }

  onReplySubmit(comment: Comments): void {
    if (this.replyingToComment && this.recipe && this.currentUser) {
      const newReply: Comments = {
        content: this.replyForm!.get('content')?.value,
        applicationUserId: this.currentUser.id,
        recipeId: this.recipe.id,
        user: this.currentUser,
        timestamp: new Date(),
        parentCommentId: comment.id
      };

      this.commentService.addComment(newReply).subscribe(reply => {
        const index = this.comments.findIndex(c => c.id === comment.id);
        if (index > -1) {
          if (!this.comments[index].replies) {
            this.comments[index].replies = [];
          }
          this.comments[index].replies!.push(reply);
        }
        this.replyForm!.reset();
        this.replyingToComment = null;
      });
    }
  }

  toggleReplyForm(comment: Comments): void {
    this.replyingToComment = this.replyingToComment === comment ? null : comment;
  }

  onCommentEdit(comment: Comments): void {
    this.editForm = this.fb.group({
      content: [comment.content, Validators.required],
      rating: [comment.rating ? comment.rating.ratingValue : null]
    });

  }

  // onCommentDelete(commentId: number): void {
  //   if (confirm('Are you sure you want to delete this comment?')) {
  //     this.commentService.deleteComment(commentId).subscribe(() => {
  //       this.comments = this.comments.filter(comment => comment.id !== commentId);
  //       this.checkCommentsLength();
  //     });
  //   }
  // }

  openDeleteDialog(commentId: number): void {
    this.commentToDeleteId = commentId;
  
    // Clean up any existing subscription
    if (this.confirmSubscription) {
      this.confirmSubscription.unsubscribe();
    }
  
    this.confirmSubscription = this.confirmDialog.confirmed.subscribe(() => {
      this.onConfirmDelete(commentId);
    });
  
    this.confirmDialog.canceled.subscribe(() => console.log('Delete canceled'));
    this.confirmDialog.open('Are you sure you want to delete this comment?');
  }

  onConfirmDelete(commentId: number): void {
    if (commentId) {
      this.commentService.deleteComment(commentId).subscribe(() => {
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        this.checkCommentsLength();
        this.triggerSuccess("Your comment has been removed!");
        this.cdr.detectChanges(); // Trigger change detection manually
      }, (error) => {
        console.log(error);
        this.triggerError("Error deleting the comment.");
      });
    }
  }

  onEditSubmit(comment: Comments): void {
    if (this.editForm && this.editForm.valid) {
      const updatedComment: Comments = {
        ...comment,
        content: this.editForm.get('content')?.value,
        rating: this.editForm.get('rating')?.value ? {
          ratingValue: this.editForm.get('rating')?.value,
          userId: comment.user?.id,
          recipeId: this.recipe?.id
        } : null
      };

      this.commentService.updateComment(updatedComment).subscribe(() => {
        // Update local comment list
        const index = this.comments.findIndex(c => c.id === comment.id);
        if (index > -1) {
          this.comments[index] = updatedComment;
        }
        this.editForm = null;
      });
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

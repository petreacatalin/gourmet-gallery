import { Component, OnDestroy, OnInit, QueryList, ViewChildren, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, Subscription, tap } from 'rxjs';
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
import { environment } from 'src/environments/environment';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe?: Recipe;
  comments: Comments[] = [];
  commentForm: FormGroup;
  editCommentForm: FormGroup;
  editReplyForm: FormGroup;
  replyForm: FormGroup; 
  currentUser?: ApplicationUser; 
  visibleComments: Comments[] = [];  
  private confirmSubscription: Subscription | null = null;
  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0; // For hover effect
  commentsToShow = 7; 
  hasMoreComments = true; // Flag to check if there are more comments to load
  currentStep: number = 0;
  replyingToComment: Comments | null = null;
  editComment: Comments | null = null;
  commentToDeleteId?: number;
  currentUrl?: string;
  frontEndUrl?: string = "https://gourmetgallery.azurewebsites.net";
  shareOptionsVisible: boolean = false;
  editCommentId?: number | null; // Track which comment is being edited
  editReplyId?: number | null ; // Track which reply is being edited
  isOwner: boolean = true;
  @ViewChildren('stepContent') stepContents!: QueryList<ElementRef>;
  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;
  @ViewChild('commentsSection', { static: false }) commentsSection!: ElementRef;

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
    private cdr: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private router: Router,
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
      rating: [null]
    });
    this.editCommentForm = this.fb.group({
      content: ['', Validators.required],
      rating: [null]
    });
    this.editReplyForm = this.fb.group({
      content: ['', Validators.required],
      rating: [null]
    });
    this.replyForm = this.fb.group({
      content: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.getUserSub();
    this.spinnerService.show();
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];   
      const slug = params['slug'];     
  
      if (id && slug) {
        this.getRecipe(id, slug);
      }
  
      this.loadComments(id);
    });
    this.spinnerService.hide();
    window.addEventListener('scroll', this.onScroll.bind(this));
    // + this.router.url; // Get the current URL
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
        submitted: new Date(),
        rating: rating,
        isEdited: false,
        helpfulCount: 0,
        notHelpfulCount: 0,
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

  onReplySubmit(parentComment: Comments): void {
    if (this.replyForm.valid && this.currentUser) {
      const newReply: Comments = {
        content: this.replyForm.get('content')?.value,
        applicationUserId: this.currentUser.id,
        recipeId: this.recipe!.id,
        user: this.currentUser,
        submitted: new Date(),
        parentCommentId: parentComment.id, // Important for keeping track of nested replies
        isEdited: false,
        helpfulCount: 0,
        notHelpfulCount: 0,
      };
  
      this.commentService.addComment(newReply).subscribe(reply => {
        // Push reply into the correct parent's replies
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push(reply);
        this.replyForm.reset(); // Reset the reply form
        this.replyingToComment = null; // Clear the reply form state
      }, error => {
        this.triggerError("Error submitting the reply.");
      });
    }
  }
  
  
  toggleReplyForm(comment: Comments | null): void {
    this.replyForm.reset();

    this.replyingToComment = this.replyingToComment === comment ? null : comment;
  }
  
  resetCommentForm(): void{
    this.commentForm.reset();
  }

  resetReplyForm(): void{
    this.replyForm.reset();
  }
  
  isEditingComment(commentId: number): boolean {
    return this.editCommentId === commentId;
  }

  isEditingReply(replyId: number): boolean {
    return this.editReplyId === replyId;
  }
  
  onCommentEdit(comment: Comments) {
    this.editCommentId = comment.id; // Set the current comment to be edited
    this.editCommentForm.patchValue({ content: comment.content }); // Pre-fill the form
  }
    
  onReplyEdit(reply: Comments) {
    this.editReplyId = reply.id;
    this.editReplyForm.patchValue({ content: reply.content });
  }

  cancelCommentEdit() {
    this.editCommentId = null; // Clear the edit state
    this.editCommentForm.reset(); // Optionally reset the form
  }

  cancelReplyEdit() {
    this.editReplyId = null; // Clear the edit state
    this.editReplyForm.reset(); // Optionally reset the form
  }

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
        // Check if this comment is a nested reply
        let parentComment: Comments | undefined;
        this.comments.forEach(comment => {
          if (comment.replies) {
            const replyIndex = comment.replies.findIndex(reply => reply.id === commentId);
            if (replyIndex !== -1) {
              parentComment = comment;
              // Remove the reply from the parent's replies array
              parentComment.replies!.splice(replyIndex, 1);
            }
          }
        });
  
        // If it's not a reply, it must be a top-level comment
        if (!parentComment) {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
        }
  
        this.checkCommentsLength();
        this.triggerSuccess("Your comment or reply has been removed!");
        this.cdr.detectChanges(); // Trigger change detection manually
      }, (error) => {
        console.log(error);
        this.triggerError("Error deleting the comment or reply.");
      });
    }
  }
  
  onEditSubmit(comment: Comments) {
    if (this.editCommentForm.valid && comment) {
        const editform = this.editCommentForm.value;
        comment.content = editform.content;
        comment.rating = editform.rating; // Assuming you have a rating to update
        
        this.commentService.updateComment(comment).pipe(
          tap(updatedComment => {
            this.cancelCommentEdit();
            this.triggerSuccess("Comment updated successfully!")

          }),
          catchError(error => {
              console.error('Error updating comment:', error);
              // Optionally, return an empty observable or handle the error accordingly
              return of(null); // or throwError(error) to propagate the error
          })
      ).subscribe(updatedComment => {
          if (updatedComment) {
              const commentIndex = this.visibleComments.findIndex(c => c.id === comment.id);
              if (commentIndex !== -1) {
                  this.visibleComments[commentIndex].content = updatedComment.content; // Update the UI with the new content
                  this.visibleComments[commentIndex].submitted = updatedComment.submitted; // Optionally update timestamp
                  this.visibleComments[commentIndex].updated = updatedComment.updated; // Optionally update timestamp
              }
              this.resetEdit(); // Reset editing state
              this.cancelCommentEdit();
    
          }
        });
    }
}

  
  onEditReplySubmit(reply: Comments) {
    if (this.editReplyForm.valid) {
      if (reply) { // Check if reply is defined
        const editform = this.editReplyForm.value;
        reply.content = editform.content;
        reply.rating = editform.rating; // Assuming you have a rating to update
        
        
        this.commentService.updateComment(reply).subscribe(updatedReply => {
          // Update the UI after editing the reply
          for (let comment of this.visibleComments) {
            const replyIndex = comment.replies!.findIndex(r => r.id === reply.id);
            if (replyIndex !== -1) {
            this.triggerSuccess("Comment updated successfully!")

              // console.log(comment.replies)
              // console.log(updatedReply)
              // comment.replies![replyIndex].content = updatedReply.content; // Update content
              // comment.replies![replyIndex].submitted = updatedReply.submitted; // Optionally update timestamp
              // comment.replies![replyIndex].updated = updatedReply.updated; // Optionally update timestamp
              break; // Exit loop once we find the reply
            }
          }
          this.resetEdit(); // Reset editing state
          this.cancelReplyEdit();

        }, error => {
          console.error('Error updating reply:', error);
        });
      } else {
        console.error('Reply object is null or undefined');
      }
    }
  }

  // Reset edit states
  resetEdit() {
    this.editCommentId = null;
    this.editReplyId = null;
    this.editCommentForm.reset();
    this.cdr.markForCheck(); // Ensure UI updates
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

 scrollToComments() {
    if (this.commentsSection) {
      this.commentsSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  setHover(rating: number) {
    this.hoverRating = rating;
  }
  onEdit(): void {
    if (this.recipe) {
      this.router.navigate(['/recipes/edit/', this.recipe.id, this.recipe.slug]);
      console.log(this.recipe.id, this.recipe.slug)
    }
  }

  markAsHelpful(comment: Comments): void {
    if (!this.currentUser) {
      this.triggerError("You need to be logged in to vote.");
      return;
    }
  
    // Prevent voting on their own comment
    if (comment.applicationUserId === this.currentUser.id) {
      this.triggerError("You cannot vote on your own comment.");
      return;
    }
  
    // Call the backend to check if the current user has already voted
    this.commentService.getUserVoteForComment(comment.id!).subscribe({
      next: (hasVoted) => {
        // Call the backend to toggle the vote (increase or decrease helpful count)
        this.commentService.updateHelpfulCount(comment.id!,comment.applicationUserId).subscribe({
          next: () => {
            if (hasVoted) {
              // If the user has already voted, decrease the helpful count, but not below 0
              comment.helpfulCount = Math.max(0, comment.helpfulCount - 1);
            } else {
              // If the user hasn't voted, increase the helpful count
              comment.helpfulCount++;
            }
  
            this.triggerSuccess("Thank you for your feedback!");
          },
          error: (error) => {
            if (error.status === 400) {
              this.triggerError(error.error.message); // Handling error
            }
            if (error.error.details.includes("The operation has been rate-limited")) {
              this.triggerError("Too many requests at once. Please don't spam the Like button!");
            }
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.triggerError("An error occurred while checking your vote status.");
      }
    });
  }
  
  
}

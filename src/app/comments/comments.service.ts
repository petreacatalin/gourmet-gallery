import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comments } from '../models/comments.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = environment.baseUrl+'/comments';

  constructor(private http: HttpClient) { }

  getCommentsForRecipe(recipeId: number): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.baseUrl}/recipe/${recipeId}`);
  }

  getCommentsById(recipeId: number): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.baseUrl}/recipe/${recipeId}`)
    };

  addComment(comment: Comments): Observable<Comments> {
    return this.http.post<Comments>(this.baseUrl, comment);
  }

  updateComment(comment: Comments): Observable<Comments> {
    return this.http.put<Comments>(`${this.baseUrl}/${comment.id}`, comment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${commentId}`);
  }
}
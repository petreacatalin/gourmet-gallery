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
    return this.http.get<{ $values: Comments[] }>(`${this.baseUrl}/recipe/${recipeId}`).pipe(
      map(response => response.$values))
    };
 
  addComment(comment: Comments): Observable<Comments> {
    return this.http.post<Comments>(this.baseUrl, comment);
  }
}
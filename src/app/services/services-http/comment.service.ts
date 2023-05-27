import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComentarioDTO } from 'src/app/model/ComentarioDTO';
import { MensajeDTO } from 'src/app/model/MensajeDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly urlApi = `${environment.URLSERVICIO}${environment.COMMENT}`;

  constructor(private http: HttpClient) { }

  createComment(comentarioDTO: ComentarioDTO): Observable<MensajeDTO> {
    const urlSaveComment = this.urlApi.substring(0, this.urlApi.length - 1);
    return this.http.post<MensajeDTO>(urlSaveComment, comentarioDTO);
  }

  getCommentsProduct(codeProduct: number): Observable<MensajeDTO> {
    const urlGetComments = `${this.urlApi}${codeProduct}`;
    return this.http.get<MensajeDTO>(urlGetComments);
  }
}

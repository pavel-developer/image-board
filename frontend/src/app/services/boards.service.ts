import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Board} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  boards: BehaviorSubject<Board[]> = new BehaviorSubject([]);
  current: BehaviorSubject<Board> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient
  ) { }

  createBoard(name: string) {
    this.http.post<{ board: Board }>(`${environment.apiUrl}/boards`, { name })
      .subscribe(({ board }) => {
        this.getBoards(() => {
          this.current.next(board);
        });
      });
  }

  getBoards(cb?: () => void) {
    this.http.get<{ boards: Board[] }>(`${environment.apiUrl}/boards`)
      .subscribe(({ boards }) => {
        this.boards.next(boards);
        if (!this.current.value && boards.length > 0) {
          this.current.next(boards[0]);
        }

        if (cb) {
          cb();
        }
      });
  }
}

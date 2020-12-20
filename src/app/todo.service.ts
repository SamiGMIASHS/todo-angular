import { HostListener, Injectable } from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';


@Injectable()
export class TodoService {

  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );
  myAngularxQrCode: string;
  constructor() { }

  getTodoListDataObservable(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  setItemsLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}) )
    });
    localStorage.setItem("todoList", JSON.stringify(this.todoListSubject.getValue().items));
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}) )
    });
    localStorage.setItem("todolist", JSON.stringify(this.todoListSubject.getValue().items));
  }

  appendItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]
    });
    localStorage.setItem("todolist", JSON.stringify(this.todoListSubject.getValue().items));
  }

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
    localStorage.setItem("todolist", JSON.stringify(this.todoListSubject.getValue().items));
  }

  hideQrcode() {
    this.myAngularxQrCode = '';
  }

  showQrcode() {
    const localStorageItems = localStorage.getItem("todolist")
    this.myAngularxQrCode = JSON.stringify(localStorageItems);
    console.log(this.myAngularxQrCode)
  }

}

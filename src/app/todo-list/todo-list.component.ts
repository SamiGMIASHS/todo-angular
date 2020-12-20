import {Component, HostListener, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import { QRCodeModule } from 'angular2-qrcode';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

    private todoList: TodoListData; 
    filter: "all" | "active" | "completed";
    myAngularxQrCode: string;
    
    constructor(private todoService: TodoService) {
        todoService.getTodoListDataObservable().subscribe( tdl => this.todoList = tdl );
    }

    
    ngOnInit() {
        if (localStorage.getItem("todolist") !== null) {
            this.todoList.items = JSON.parse(localStorage.getItem("todolist"));
          }
    }

    get label(): string {
        return this.todoList.label;
    }
    
    get items(): TodoItemData[] {
        return this.todoList.items;
    }

    //Items active
    get itemsActive(): TodoItemData[]{
        return this.items.filter(i => !i.isDone);
    }

    //Items completed
    get itemsOk(): TodoItemData[]{
        return this.items.filter(i => i.isDone);
    }

    appendItem(label: string){
        this.todoService.appendItems({
            label,
            isDone:false
        });
    }

    itemDone(item: TodoItemData, done:boolean){
        this.todoService.setItemsDone(done,item);
    }

    //Check all
    @HostListener('document:keydown.control.b')
    toggleAll() {
        let allItemOk = true;
        for(let item of this.todoList.items){
            if (item.isDone == false){
                this.todoService.setItemsDone(true,item);
                allItemOk = false;
            }
        }
        if(allItemOk){
         for(var item of this.todoList.items){
              this.todoService.setItemsDone(false,item);
             }
             allItemOk = false;
            }
          
    }

    itemLabel(item: TodoItemData, label:string){
        this.todoService.setItemsLabel(label,item);
    }
  
    //Suppression d'un item
    itemDelete(item: TodoItemData) {
        this.todoService.removeItems(item);
    } 

    //Suppression de tous les items
    allDelete(items: TodoItemData[]){
        this.todoService.removeItems(...items);
    }

    //Filtre des items
    filterItems(): TodoItemData[]{
        if (this.filter == "all"){
            return this.todoList.items;
        }
        if (this.filter == "active"){
            return this.itemsActive;
        }
        if (this.filter == "completed"){
            return this.itemsOk;
        }
        return this.todoList.items;
    }

}

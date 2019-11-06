import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../services/task.service';
import {Task} from '../../models/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  filtredTasks: Task[] = [];

  myTask: Task = {
    label : '',
    completed : false
  };

  editForm = false;
  showForm = false;
  searchText = '';
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.taskService.findAll()
      .subscribe(tasks => {
        this.filtredTasks = this.tasks = tasks;
      });
  }

  deleteTask(id) {
    this.taskService.delete(id)
      .subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      });
  }

  persistTask() {
    this.taskService.persist(this.myTask)
      .subscribe((task) => {
          this.tasks = [task, ...this.tasks];
          this.resetTask();
          this.showForm = false;
        }
      );
  }

  resetTask() {
    this.myTask = {
      label: '',
      completed: false
    };
  }

  toggleCompleted( task: Task) {
    this.taskService.completed(task.id , task.completed)
      .subscribe(() => {
        task.completed = !task.completed;
      });
  }

  editTask(task: Task) {
    this.myTask = task;
    this.editForm = true;
    this.showForm = true;
  }

  updateTask() {
    this.taskService.update(this.myTask)
      .subscribe(task => {
        this.editForm = false;
        this.resetTask();
        this.showForm = false;
      });
  }

  searchTasks() {
    this.filtredTasks = this.tasks.filter((task) => task.label.toLowerCase().includes(this.searchText.toLowerCase()));
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../services/tasks';
import { ProjectTask, TASK_STATUSES } from '../../models/task.model';

@Component({
    selector: 'app-tasks',
    imports: [CommonModule, FormsModule],
    templateUrl: './tasks.html',
    styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {
    allTasks: ProjectTask[] = [];
    filteredTasks: ProjectTask[] = [];
    loading = true;

    searchQuery = '';
    statusFilter = '';
    taskStatuses = TASK_STATUSES;

    constructor(
        private tasksService: TasksService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        this.loading = true;
        this.tasksService.getAllTasks().subscribe({
            next: (data) => {
                this.allTasks = data;
                this.filterTasks();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading tasks:', err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    filterTasks() {
        this.filteredTasks = this.allTasks.filter(task => {
            const matchSearch = !this.searchQuery ||
                task.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                task.responsible.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchStatus = !this.statusFilter || task.status === this.statusFilter;

            return matchSearch && matchStatus;
        });
    }

    getStatusClass(status: string): string {
        const map: { [key: string]: string } = {
            'Назначена': 'status-assigned',
            'В работе': 'status-in-progress',
            'Завершена': 'status-completed',
            'Срыва сроков': 'status-overdue'
        };
        return map[status] || '';
    }

    getInitials(name: string): string {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }

    getDeadlineClass(deadlineStr: string): string {
        if (!deadlineStr) return '';
        const deadline = new Date(deadlineStr);
        const now = new Date();

        // Reset time for accurate comparison
        now.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        if (deadline < now) {
            return 'deadline-overdue';
        }

        // Check if deadline is within next 3 days
        const threeDaysFromNow = new Date(now);
        threeDaysFromNow.setDate(now.getDate() + 3);

        if (deadline <= threeDaysFromNow) {
            return 'deadline-soon';
        }

        return '';
    }
}

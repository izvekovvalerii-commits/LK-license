import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects';
import { StoresService } from '../../services/stores';
import { TasksService } from '../../services/tasks';
import { Project, PROJECT_TYPES, PROJECT_STATUSES, REGIONS, CFO_LIST } from '../../models/project.model';
import { Store } from '../../models/store.model';
import { ProjectTask, TASK_TYPES, TASK_STATUSES, TASK_RESPONSIBLE_MAP, TASK_DEADLINE_DAYS } from '../../models/task.model';
import { DocumentsService } from '../../services/documents';
import { ProjectDocument, DOCUMENT_TYPES, DOCUMENT_STATUSES } from '../../models/document.model';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  stores: Store[] = [];
  loading = true;
  showCreateModal = false;
  showProjectCard = false;
  showCreateTaskModal = false;
  selectedProject: Project | null = null;
  searchQuery: string = '';
  projectTasks: ProjectTask[] = [];

  // Documents
  activeTab: 'info' | 'tasks' | 'docs' = 'info';
  documents: ProjectDocument[] = [];
  docTypes = DOCUMENT_TYPES;
  isUploading = false;
  selectedFile: File | null = null;
  selectedDocType = DOCUMENT_TYPES[0];

  // Create form
  newProject: Partial<Project> = {
    projectType: '',
    status: 'Создан',
    mp: 'Менеджер проекта',
    nor: 'Начальник отдела развития',
    stMRiZ: 'Старший менеджер',
    rnr: 'Руководитель направления развития'
  };
  selectedStoreId: number | null = null;

  // Task form
  newTask: Partial<ProjectTask> = {
    taskType: '',
    status: 'Назначена'
  };

  projectTypes = PROJECT_TYPES;
  projectStatuses = PROJECT_STATUSES;
  regions = REGIONS;
  cfoList = CFO_LIST;
  taskTypes = TASK_TYPES;
  taskStatuses = TASK_STATUSES;

  constructor(
    private projectsService: ProjectsService,
    private storesService: StoresService,
    private tasksService: TasksService,
    private docsService: DocumentsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.loadStores();
  }

  loadProjects() {
    this.projectsService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  loadStores() {
    this.storesService.getStores().subscribe({
      next: (data) => this.stores = data,
      error: (err) => console.error('Error loading stores:', err)
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.selectedStoreId = null;
  }

  selectStore() {
    if (!this.selectedStoreId) return;

    const store = this.stores.find(s => s.id === this.selectedStoreId);
    if (store) {
      this.newProject.address = store.address;
      this.newProject.totalArea = store.totalArea;
      this.newProject.tradeArea = store.tradeArea;
      this.newProject.region = store.region;
    }
  }

  createProject() {
    if (!this.selectedStoreId || !this.newProject.projectType || !this.newProject.gisCode) {
      alert('Заполните обязательные поля');
      return;
    }

    const project: Project = {
      storeId: this.selectedStoreId,
      projectType: this.newProject.projectType!,
      status: this.newProject.status || 'Создан',
      gisCode: this.newProject.gisCode!,
      address: this.newProject.address!,
      totalArea: this.newProject.totalArea,
      tradeArea: this.newProject.tradeArea,
      region: this.newProject.region!,
      cfo: this.newProject.cfo!,
      mp: this.newProject.mp!,
      nor: this.newProject.nor!,
      stMRiZ: this.newProject.stMRiZ!,
      rnr: this.newProject.rnr!
    };

    this.projectsService.createProject(project).subscribe({
      next: () => {
        this.loadProjects();
        this.closeCreateModal();
        this.resetForm();
      },
      error: (err) => console.error('Error creating project:', err)
    });
  }

  resetForm() {
    this.newProject = {
      projectType: '',
      status: 'Создан',
      mp: 'Менеджер проекта',
      nor: 'Начальник отдела развития',
      stMRiZ: 'Старший менеджер',
      rnr: 'Руководитель направления развития'
    };
    this.selectedStoreId = null;
  }

  viewProject(project: Project) {
    if (project.id) {
      this.projectsService.getProject(project.id).subscribe({
        next: (fullProject) => {
          this.selectedProject = fullProject;
          this.showProjectCard = true;
          this.activeTab = 'info';
          this.loadProjectTasks();
          this.loadDocuments();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading project details:', err);
          this.selectedProject = project;
          this.showProjectCard = true;
          this.loadProjectTasks();
          this.cdr.detectChanges();
        }
      });
    } else {
      this.selectedProject = project;
      this.showProjectCard = true;
    }
  }

  closeProjectCard() {
    this.showProjectCard = false;
    this.selectedProject = null;
  }

  updateStatus(project: Project, newStatus: string) {
    if (project.id) {
      this.projectsService.updateStatus(project.id, newStatus).subscribe({
        next: () => this.loadProjects(),
        error: (err) => console.error('Error updating status:', err)
      });
    }
  }

  // Task methods
  openCreateTaskModal() {
    this.showCreateTaskModal = true;
    this.resetTaskForm();
  }

  closeCreateTaskModal() {
    this.showCreateTaskModal = false;
    this.resetTaskForm();
  }

  onTaskTypeChange() {
    if (!this.newTask.taskType) return;
    this.newTask.responsible = TASK_RESPONSIBLE_MAP[this.newTask.taskType] || '';
    this.newTask.name = `${this.newTask.taskType} - ${this.selectedProject?.store?.name || 'Проект'}`;
    const days = TASK_DEADLINE_DAYS[this.newTask.taskType] || 14;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    this.newTask.normativeDeadline = deadline.toISOString().split('T')[0];
  }

  createTask() {
    if (!this.selectedProject?.id) {
      alert('Ошибка: Проект не выбран');
      return;
    }

    if (!this.newTask.taskType || !this.newTask.name || !this.newTask.responsible || !this.newTask.normativeDeadline) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const task: ProjectTask = {
      projectId: this.selectedProject.id,
      name: this.newTask.name,
      taskType: this.newTask.taskType,
      responsible: this.newTask.responsible,
      normativeDeadline: new Date(this.newTask.normativeDeadline).toISOString(),
      status: this.newTask.status || 'Назначена'
    };

    console.log('Sending task:', task);

    this.tasksService.createTask(task).subscribe({
      next: (created) => {
        console.log('Task created:', created);
        this.loadProjectTasks();
        this.closeCreateTaskModal();
      },
      error: (err) => {
        console.error('SERVER ERROR:', err);
        alert(`Ошибка при создании задачи: ${err.status} ${err.statusText}`);
      }
    });
  }

  loadProjectTasks() {
    if (this.selectedProject?.id) {
      this.tasksService.getProjectTasks(this.selectedProject.id).subscribe({
        next: (tasks) => {
          this.projectTasks = tasks;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading tasks:', err)
      });
    }
  }

  resetTaskForm() {
    this.newTask = {
      taskType: '',
      status: 'Назначена'
    };
  }

  getTaskStatusClass(status: string): string {
    const map: { [key: string]: string } = {
      'Назначена': 'task-assigned',
      'В работе': 'task-in-progress',
      'Завершена': 'task-completed',
      'Срыва сроков': 'task-overdue'
    };
    return map[status] || '';
  }

  // Gantt Chart logic
  showGanttModal = false;
  ganttDates: Date[] = [];

  openGanttModal() {
    if (!this.projectTasks.length) {
      alert('В проекте нет задач для отображения графика');
      return;
    }
    this.calculateGanttTimeline();
    this.showGanttModal = true;
  }

  closeGanttModal() {
    this.showGanttModal = false;
  }

  calculateGanttTimeline() {
    if (!this.projectTasks.length) return;

    const dates = this.projectTasks.flatMap(t => [
      t.createdAt ? new Date(t.createdAt) : new Date(),
      new Date(t.normativeDeadline)
    ]);

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);

    this.ganttDates = [];
    const curr = new Date(minDate);
    while (curr <= maxDate) {
      this.ganttDates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
  }

  getTaskStartOffset(task: ProjectTask): number {
    if (!this.ganttDates.length) return 0;
    const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
    const minDate = this.ganttDates[0];
    const diffTime = Math.abs(startDate.getTime() - minDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTaskDuration(task: ProjectTask): number {
    const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
    const endDate = new Date(task.normativeDeadline);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
  }

  // --- Documents Logic ---

  loadDocuments() {
    if (!this.selectedProject?.id) return;
    this.docsService.getByProject(this.selectedProject.id).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading documents:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadDocument() {
    if (!this.selectedFile || !this.selectedProject?.id) return;

    this.isUploading = true;
    this.docsService.upload(this.selectedProject.id, this.selectedFile, this.selectedDocType)
      .subscribe({
        next: (doc) => {
          this.documents.unshift(doc);
          this.isUploading = false;
          this.selectedFile = null;
          // You might want to reset the file input element here if you had a reference
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading = false;
          this.cdr.detectChanges();
        }
      });
  }

  downloadDoc(doc: ProjectDocument) {
    this.docsService.download(doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.name; // Backend uses name from ContentHeaders, or we set it here
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Download failed', err)
    });
  }

  deleteDoc(doc: ProjectDocument) {
    if (!confirm('Удалить документ ' + doc.name + '?')) return;

    this.docsService.delete(doc.id).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== doc.id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Delete failed', err)
    });
  }

  getFriendlyFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

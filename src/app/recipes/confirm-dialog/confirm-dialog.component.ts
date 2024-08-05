import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  message: string = '';
  ngOnInit(): void {
    
  }

  @ViewChild('confirmDialog', { static: false }) modalElement!: ElementRef;

  private modalInstance: any;

  constructor() {}

  ngAfterViewInit() {
    if (this.modalElement) {
      this.modalInstance = new (window as any).bootstrap.Modal(this.modalElement.nativeElement);
    }
  }

  open(message: string) {
    this.message = message;
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  onConfirm() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.confirmed.emit();
  }

  onCancel() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.canceled.emit();
  }
}
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NotificationService } from '../notifications.service';
import { Notification } from 'src/app/models/notification.interface';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications: boolean = false;
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.startConnection();
    this.fetchNotifications();
    this.notificationService.notifications$.subscribe((notification) => {
      this.notifications.push(notification);
      this.unreadCount++;
    });
  }

  ngOnDestroy(): void {
    this.notificationService.stopConnection();
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter((n) => !n.isRead).length;
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'Like':
        return 'thumb_up';
      case 'Comment':
        return 'comment';
      case 'Follow':
        return 'person_add';
      case 'Recipe':
        return 'restaurant';
      default:
        return 'notifications';
    }
  }

  markNotificationAsRead(notification: Notification): void {
    if (notification) {
      // Send the update to the backend to persist the change
      this.notificationService.markNotificationAsRead(notification.id).subscribe(
        (response) => {
          notification.isRead = true;
          this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
          console.log('Notification marked as read:', response);
        },
        (error) => {
          // Handle error: Do nothing or handle as per your requirement
          console.error('Failed to mark notification as read', error);
          // Optionally, you can show a message to the user or try again later
        }
      );
    }
  }
  clearAllNotifications() {
    this.notificationService.clearAllNotifications().subscribe(
      (response: any) => {
        // Clear notifications from the UI
        this.notifications = [];
        this.unreadCount = 0;
        console.log(response.message); // Optional: success message
      },
      error => {
        console.error('Failed to clear notifications', error); // Handle errors
      }
    );
  }

@HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const notificationBellElement = document.querySelector('.notification-bell');

    if (notificationBellElement && !notificationBellElement.contains(targetElement)) {
      this.showNotifications = false;
    }
  }
}
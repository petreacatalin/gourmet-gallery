import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Notification } from 'src/app/models/notification.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection!: HubConnection;
  private notificationsSubject = new Subject<Notification>();
  public notifications$ = this.notificationsSubject.asObservable();
  private apiUrlSignalR = `${environment.apiUrlSignalR}`;
  private baseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  // Start the SignalR connection to the hub
    startConnection(): void {
      this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrlSignalR}/notificationHub`, {
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
          accessTokenFactory: () => {
            const token = localStorage.getItem("token");
            return token ? token : '';  // Return empty string if token is null
          }
        }) 
      .configureLogging(signalR.LogLevel.Information)
      .build();
    
      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connection established.');
        })
        .catch((err) => {
          console.error('Error establishing SignalR connection:', err);
          setTimeout(() => this.startConnection(), 20000); // Reconnect after 5 seconds
        });
    
      // Listen for notifications
      this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
        this.notificationsSubject.next(notification);
      });
    
      this.hubConnection.onclose(() => {
        console.log('SignalR connection closed.');
        setTimeout(() => this.startConnection(), 20000); // Reconnect after 5 seconds
      });
    }

    stopConnection(): void {
      if (this.hubConnection) {
        this.hubConnection.stop();
      }
    }
    getNotifications(): Observable<Notification[]> {
      return this.http.get<Notification[]>(`${this.baseUrl}/notifications`);
    }

    clearAllNotifications(): Observable<any>  {
      return this.http.delete(`${this.baseUrl}/notifications/clear-all-notifications`);
    }

    markNotificationAsRead(notificationId: number): Observable<any> {
      return this.http.post(`${this.baseUrl}/notifications/mark-read/${notificationId}`, {});
    }
}

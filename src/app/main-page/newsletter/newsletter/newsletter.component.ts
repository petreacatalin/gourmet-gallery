import { Component, OnInit } from '@angular/core';
import { NewsletterService } from '../newsletter.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {
 email: string = '';

 constructor(
  private newsletterService: NewsletterService,
) {}

ngOnInit(): void {
  
}

subscribeToNewsletter(email:string): void {
  if (email) {
    this.newsletterService.subscribeToNewsletter(email).subscribe(
      () => {
        //this.triggerSuccess.success('You have successfully subscribed to our newsletter!');
      },
      (error) => {
       // this.toastr.error('There was an error while subscribing to the newsletter.');
        console.error('Subscription error:', error);
      }
    );
  }
}
}
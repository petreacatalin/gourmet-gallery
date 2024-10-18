import { Component, HostListener, OnInit } from '@angular/core';
import { ScrollTopService } from './scroll-top.service';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent implements OnInit {

  showScrollTopButton = false;

  constructor(private scrollService: ScrollTopService) {}

  ngOnInit() {
    this.scrollService.getScrollPosition().subscribe(scrollPosition => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.showScrollTopButton = scrollPosition > pageHeight * 0.4;
    });
  }

  scrollToTop(): void {
    this.scrollService.scrollToTop();
  }
}
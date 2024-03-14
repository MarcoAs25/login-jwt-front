import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  timer: string = '10';
  remainingSeconds: number;
  timerInProgress: boolean = false;
  timerInterval: any;

  constructor(private router: Router){
    this.startTimer(10);
  }

  startTimer(time: number) {
    this.remainingSeconds = time;
    this.timerInProgress = true;
    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.timer = this.remainingSeconds.toString();
      } else {
        this.timerInProgress = false;
        this.timer = 'Redirecting..';
        this.router.navigate(['']);
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
}

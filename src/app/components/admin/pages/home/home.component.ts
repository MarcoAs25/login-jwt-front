import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/components/auth/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private authService: AuthService){}

  logout(){
    this.authService.logout();
  }

  test(){
    this.authService.test().subscribe((_)=>{
      alert("request feita com sucesso!")
    })
  }
}

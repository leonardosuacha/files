import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [UserService]
})

export class LoginComponent implements OnInit{
  public title:string;
  public user: User;
  public status:string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Identifícate';
    this.user = new User("","","","","","","ROLE_USER","");
  }

  ngOnInit(){
    console.log('Login Component loaded...');
  }

  onSubmit(){
    this._userService.login(this.user).subscribe(
      response => {
        this.identity = response.user;

        if(!this.identity || !this.identity._id){
          this.status = 'error';
        }else{
          //persistir los datos del usuario
          localStorage.setItem('identity', JSON.stringify(this.identity));

          //conseguir el token
          this.getToken();
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage)
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    )
  }

  getToken(){
    this._userService.login(this.user, 'true').subscribe(
      response => {
        this.token = response.token;

        if(this.token.length <= 0 ){
          this.status = 'error';
        }else{
          //persistir token
          localStorage.setItem('token', JSON.stringify(this.token));
          this.getCounters();

          //conseguir contadores/estadisticas de usuario
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage)
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    )
  }


  getCounters(){
    this._userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats',JSON.stringify(response));
        this.status = 'success'
        this._router.navigate(['/']);
      },
      error => {
        console.log(<any>error);
      }
    )
  }


}

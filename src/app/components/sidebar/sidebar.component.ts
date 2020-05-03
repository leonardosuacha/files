import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  providers: [UserService,PublicationService,UploadService]
})
export class SideBarComponent implements OnInit{
  public identity;
  public token;
  public stats;
  public url:string;
  public status;
  public publication: Publication;
  @Output() sended = new EventEmitter();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService
  ){
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.publication = new Publication("","","","",this.identity._id)
  }

  ngOnInit(){
    console.log('SideBar Component loaded...');
    //console.log(this.stats);

  }

  onSubmit(form, $event){
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if(response.publication){
          //subir imagen
          if(this.filesToUpload && this.filesToUpload.length){

          this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
              .then((result:any) => {
                this.publication.file = result.image;
                form.reset();
                this.status = 'success';
                this.stats.publications += 1;
                localStorage.setItem('stats',JSON.stringify(this.stats));
                this.sended.emit({sended:'true'});
                this._router.navigate(['/timeline']);
              });

            }else{
              form.reset();
              this.status = 'success';
              this.stats.publications += 1;
              localStorage.setItem('stats',JSON.stringify(this.stats));
              this.sended.emit({sended:'true'});
              this._router.navigate(['/timeline']);
            }


        }else{
          this.status = 'error';
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }





}

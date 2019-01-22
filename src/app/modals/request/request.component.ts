import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/services/user.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { RequestService } from 'src/app/services/request.service';

export interface PromptModel{
  scope: any;
  currentRequest: any;
}
@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel {


    scope: any;
    currentRequest: any;
    shouldAdd:string = 'yes';

  constructor(public dialogService: DialogService, private userService: UserService, private requestsService: RequestService) {
    super(dialogService);
   }

 accept(){
   if(this.shouldAdd == 'yes'){
     this.requestsService.setRequestStatus(this.currentRequest, 'accepted').then((data)=>{
       console.log(data);
       this.userService.addFriend(this.scope.user.uid, this.currentRequest.sender).then(()=>{
         alert('solicitud aceptada con exito');
       })
     }).catch((error)=>{
       console.log(error);
     });
   }else    if(this.shouldAdd == 'no'){
    this.requestsService.setRequestStatus(this.currentRequest, 'rejected').then((data)=>{
      console.log(data);
    }).catch((error)=>{
      console.log(error);
    });
  }else    if(this.shouldAdd == 'later'){
    this.requestsService.setRequestStatus(this.currentRequest, 'decide_later').then((data)=>{
      console.log(data);
    }).catch((error)=>{
      console.log(error);
    });
  }
 }

}

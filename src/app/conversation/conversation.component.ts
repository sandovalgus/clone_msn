import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {User} from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
friendId:any;
friend: User;
user: User;
conversation_id:string;
textMessage:string;
conversation:any[];
shake:boolean = false;
  constructor(
              private activateRoute: ActivatedRoute, 
              private UserService: UserService,
              private conversationService: ConversationService,
              private authenticateService:AuthenticationService) { 
    this.friendId = this.activateRoute.snapshot.params['uid'];
    console.log(this.friendId);

    // this.UserService.getUserById(this.friendId).valueChanges().subscribe((data:User)=>{
    //   this.friend= data;
    // }, (error)=>{
    //   console.log(error);
    // });
    this.authenticateService.getStatus().subscribe((session)=>{
      console.log('session ' + session);
      this.UserService.getUserById(session.uid).valueChanges().subscribe((user: User)=>{
        this.user = user;
        this.UserService.getUserById(this.friendId).valueChanges().subscribe((data:User)=>{
          this.friend= data;
          const ids =[this.user.uid, this.friend.uid].sort();
          this.conversation_id = ids.join('|');
          this.getConversation();
        }, (error)=>{
          console.log(error);
        });
      });
    });
  }

  sendMessage(){
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receive: this.friend.uid,
      type: 'text' 
    };
    this.conversationService.createConversation(message).then(()=>{
      this.textMessage = '';
    });
  }

  sendZumbido(){
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: null,
      sender: this.user.uid,
      receive: this.friend.uid,
      type: 'zumbido' 
    };
    this.conversationService.createConversation(message).then(()=>{ });
    this.doZumbido();
    this.shake = true;

    window.setTimeout(()=> {
      this.shake=false; 
    }, 1000);
  }

  doZumbido(){
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
  }

getConversation(){
  this.conversationService.getConversations(this.conversation_id).valueChanges().subscribe((data)=>{
    console.log(data);
    this.conversation= data;
    this.conversation.forEach((message)=>{
      if(!message.seen){
        message.seem = true;
        this.conversationService.editConversation(message);
        if(message.type == 'text'){
          const audio = new Audio('assets/sound/new_message.m4a');
          audio.play();
        }else if (message.type == 'zumbido'){
          this.doZumbido();
        }
      }
    });
  },
  (erro)=>{
    console.log(erro);
  }
  );
}

getUserNickById(id){
  if(id === this.friend.uid){
    return this.friend.nick;
  }else{
    return this.user.nick;
  }
}

  ngOnInit() {
  } 

}

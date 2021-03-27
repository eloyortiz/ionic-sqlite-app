import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainForm: FormGroup;
  Data: any[] = [];
  
  
  constructor( 
    private dbSrv: DbService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dbSrv.dbState()
      .subscribe( (res) => {
        if(res){
          this.dbSrv.fetchSongs()
            .subscribe( item => {
              this.Data = item;
            })
        }
      });

      this.mainForm = this.formBuilder.group({
        artist: [''],
        song: ['']
      })
    
  }

  storeData(){
    this.dbSrv.addSong( this.mainForm.value.artist, this.mainForm.value.song )
      .then( res => {
        this.mainForm.reset();
      });
  }

  deleteSong(id){
    this.db.deleteSong(id).then(async(res) => {
      let toast = await this.toast.create({
        message: 'Song deleted',
        duration: 2500
      });
      toast.present();      
    })
  }


}

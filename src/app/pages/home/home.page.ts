import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Song } from '../../models/song';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainForm: FormGroup;
  songs: Song[] = [];
  
  
  constructor( 
    private dbSrv: DbService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dbSrv.getDbState()
      .subscribe( (ready) => {
        console.log("readyDB: ", ready);
        
        if(ready){
          this.dbSrv.getSongs().subscribe( data => {
              this.songs = data;
            });
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
    this.dbSrv.deleteSong(id).then( async(res) => {
      let toast = await this.toastCtrl.create({
        message: 'Song deleted',
        duration: 1500,
        position: 'top'
      });
      toast.present();      
    })
  }


}

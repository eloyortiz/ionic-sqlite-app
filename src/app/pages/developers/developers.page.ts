import { Component, OnInit } from '@angular/core';
import { DatabaseService, Developer } from '../../services/database.service';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
})
export class DevelopersPage implements OnInit {

  public developers: Developer[] = [];
  public products$: Observable<any[]>;
  public developer = {};
  public product = {};
  public selectedView = 'devs';
  public cargando:boolean = true;

  constructor( 
    private dbSrv: DatabaseService,
    private toast: ToastController
    ) { }

  ngOnInit() {
    this.dbSrv.getDatabaseState$().subscribe( dbReady => {
      this.cargando = true;
      if( dbReady ){
        this.dbSrv.getDevs$().subscribe( devs => {
          this.developers = devs;
        })
        this.products$ = this.dbSrv.getProducts$();
        this.cargando = false;
      }
    });
  }

  addDeveloper(){
    let skills = this.developer['skills'].toString().split(",").map( skill => skill.trim() );
    console.log('skills :>> ', skills);
    //skills = skills.map( skill => skill.trim() );

    this.dbSrv.addDeveloper( this.developer['name'], skills, this.developer['img'])
      .then(async _ => {
        let toast = await this.toast.create({
          message: 'Developer added',
          duration: 1500,
          position: 'top'
        });
        toast.present();
        this.developer = {};
      });
  }

  async addProduct(){
    if( this.product['name'] !== undefined && this.product['creatorId'] !== undefined ){
      this.dbSrv.addProduct(this.product['name'], this.product['creatorId'])
      .then( async _ => {
        let toast = await this.toast.create({
          message: 'Product added',
          duration: 1500,
          position: 'top'
        });
        toast.present();
        this.product = {};
      })
      .catch( err => console.log(err) );
    }
    else{
      let toast = await this.toast.create({
        message: 'Data incompleted',
        duration: 1500,
        position: 'top'
      });
      toast.present();
    }
   
  }

}

import { Component, OnInit } from '@angular/core';
import { DatabaseService, Developer } from '../../services/database.service';
import { Observable } from 'rxjs';

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

  constructor( private dbSrv: DatabaseService) { }

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
      .then(_ => {
        console.log('addDeveloper _ :>> ', _);
        this.developer = {};
      });
  }

  addProduct(){
    console.log('this.product :>> ', this.product);
    this.dbSrv.addProduct(this.product['name'], this.product['creator'])
      .then( _ => {
        this.product={};
      })
      .then(_=> console.log('Product added'))
      .catch( err => console.log(err) );
  }

}

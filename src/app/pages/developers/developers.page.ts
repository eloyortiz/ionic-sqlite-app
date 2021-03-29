import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Developer } from '../../interfaces/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
})
export class DevelopersPage implements OnInit {

  public developers: Developer[] = [];
  public products2: Observable<any[]>;
  public products: any[] = [];
  public developer = {};
  public product = {};
  public cargando:boolean = true;

  selectedView = 'devs';

  constructor( private dbSrv: DatabaseService) { }

  ngOnInit() {
    this.dbSrv.getDatabaseState().subscribe( rdy => {
      this.cargando = true;
      if( rdy ){
        this.dbSrv.getDevs().subscribe( devs => {
          this.developers = devs;
          this.cargando = false;
        })
        this.dbSrv.getProducts().subscribe(prods => {
          console.log(prods);
          
          this.products = prods;
        });
      }
    });
  }

  addDeveloper(){
    let skills = this.developer['skills'].split(',');
    skills = skills.map( skill => skill.trim() );

    this.dbSrv.addDeveloper( this.developer['name'], skills, this.developer['img'])
      .then(_ => {
        this.developer = {};
      });
  }

  addProduct(){
    this.dbSrv.addProduct(this.product['name'], this.product['creator'])
      .then( _ => {
        this.product={};
      });
  }

}

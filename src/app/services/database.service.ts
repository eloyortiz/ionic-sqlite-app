import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Developer } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  developers = new BehaviorSubject([]);
  products = new BehaviorSubject([]);

  constructor( private plt: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient) { 
              
    this.plt.ready().then( () => {
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
      .then( (db: SQLiteObject) => {
        this.database = db;
        this.seedDatabase();
      });
    });
  }

  seedDatabase(){
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe( sql => {
        this.sqlitePorter.importSqlToDb( this.database, sql )
          .then( _ => {
            this.loadDevelopers();
            this.loadProducts();
            this.dbReady.next(true);
          })
          .catch( console.error );
      });
  }

  getDatabaseState(){
    return this.dbReady.asObservable();
  }

  getDevs(): Observable<Developer[]>{
    return this.developers.asObservable();
  }

  getProducts(): Observable<any[]>{
    return this.products.asObservable();
  }

  // parseData(data){
  //   let skills = [];
  //   if (data.rows.item(0).skills != '') {
  //     skills = JSON.parse(data.rows.item(0).skills);
  //   }

  //   return {
  //     id: data.rows.item(0).id,
  //     name: data.rows.item(0).name, 
  //     skills: skills, 
  //     img: data.rows.item(0).img
  //   }
  // }


  loadDevelopers(){
    return this.database.executeSql( 'SELECT * FROM developers', []).then( data => {
      let developers: Developer[] = [];

      if(data.rows.length > 0){
        for( let i=0; i < data.rows.length; i++){
          let skills = [];
          if( data.rows.item(i).skills != ''){
            skills = JSON.parse(data.rows.item(i).skills);
          }

          developers.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            skills,
            img: data.rows.item(i).img
          });
        }
      }
      this.developers.next(developers);
    });
  }

  addDeveloper(name, skills, img){
    let data = [name, JSON.stringify(skills), img];

    return this.database.executeSql( 'INSERT INTO developers (name, skills, img) VALUES (?, ?, ?)', data )
      .then( data => {
        this.loadDevelopers
      });
  }

  getDeveloper(id): Promise<Developer>{
    return this.database.executeSql('SELECT * FROM developers WHERE id = ?', [id])
      .then( data => {
        let skills = [];
        if (data.rows.item(0).skills != '') {
          skills = JSON.parse(data.rows.item(0).skills);
        }

        return {
          id: data.rows.item(0).id,
          name: data.rows.item(0).name, 
          skills: skills, 
          img: data.rows.item(0).img
        }
      });
  }

  deleteDeveloper(id){
    return this.database.executeSql('DELETE FROM developers WHERE id = ?', [id])
      .then( _ => {
        this.loadDevelopers();
        this.loadProducts();
      });
  }

  updateDeveloper(dev: Developer){
    let data = [dev.name, JSON.stringify(dev.skills), dev.img];

    return this.database.executeSql(`UPDATE developers SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data)
      .then( data => {
        this.loadDevelopers();
      })
  }

  loadProducts(){
    let query = 'SELECT p.name, p.id, d.name AS creator FROM products AS p JOIN developers AS d ON d.id = p.creatorId';

    return this.database.executeSql(query, []).then( data => {
      let products = [];
      if(data.rows.length > 0){
        for (let i=0; i < data.rows.length; i++){
          products.push({
            name: data.rows.item(i).name,
            id: data.rows.item(i).id,
            creator: data.rows.item(i).creator,
          });
        }
      }
    });
  }

  addProduct(name, creator){
    let data = [name, creator];

    return this.database.executeSql('INSERT INTO products (name, creatorId) VALUES (?, ?)', data)
      .then( data => {
        return this.loadProducts();
      });
  }
  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  
  private _storage: SQLiteObject;
  private _isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  songsList = new BehaviorSubject([]);

  constructor( 
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
      ) { 
        this.platform.ready()
          .then( () => {
            this.sqlite.create({
              name: 'remix.db',
              location: 'default'
            })
            .then( (db: SQLiteObject) => {
              this._storage = db;
              this.getFakeData();
            });
          });
  }

  dbState(){
    return this._isDbReady.asObservable();
  }

  fetchSongs(): Observable<Song[]>{
    return this.songsList.asObservable();
  }

  getFakeData() {
    this.httpClient.get( 'assets/dump.sql', {responseType: 'text'} )
    .subscribe(data => {
      this.sqlPorter.importSqlToDb(this._storage, data)
        .then(_ => {
          this.getSongs();
          this._isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  // GET LIST
  getSongs(){
    return this._storage.executeSql( 'SELECT * FROM songtable', [] )
      .then( res => {
        let items: Song[] = [];

        console.log(res);
        

      })

    
  }

  addSong(){

  }

  getSong(id){

  }

  updateSong(id, song: Song){

  }

  deleteSong(id){

  }


}

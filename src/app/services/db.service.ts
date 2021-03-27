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

        if(res.rows.length > 0){
          for(var i=0; i < res.rows.length; i++){
            items.push({
              id: res.rows.item(i).id,
              artist_name: res.rows.item(i).artist_name,
              song_name: res.rows.item(i).song_name 
            });
          }
        }
        this.songsList.next(items);
      });
  }

  addSong(artist_name, song_name){
    let data = [artist_name, song_name];

    return this._storage.executeSql( 'INSET INTO songtable (artist_name, song_name VALUES (?, ?)', data)
      .then( res => {
        this.getSongs();
      });
  }

  getSong(id): Promise<Song>{
    return this._storage.executeSql( 'SELECT * FROM songtable WHERE id = ?', id)
      .then( res => {
        return {
          id: res.rows.item(0).id,
          artist_name: res.rows.item(0).artist_name,
          song_name: res.rows.item(0).song_name 
        }
      });
  }

  updateSong(id, song: Song){
    let data = [song.artist_name, song.song_name];
    return this._storage.executeSql( `UPDATE songtable SET artist_name = ?, song_name = ?, WHERE id = ${id}`, data)
      .then( data => {
        this.getSongs();
      });
  }

  deleteSong(id){
    return this._storage.executeSql( 'DELETE FROM songtable WHERE id = ?', [id])
      .then( res => {
        this.getSongs();
      });
  }


}

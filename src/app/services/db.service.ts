import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Song } from './song';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean>;
  songList: BehaviorSubject<any[]>;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private http: HttpClient,
    private sqlPorter: SQLitePorter
  ) {
    this.isDbReady = new BehaviorSubject(false);
    this.songList = new BehaviorSubject([]);

    this.platform.ready()
      .then( () => {
        this.sqlite.create({
          name: 'positronx_db.db',
          location: 'default'
        })
        .then( (db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
        })
        .catch( error => console.error(error) );
      })
      .catch( error => console.error(error) );
  }

  dbState(){
    return this.isDbReady.asObservable();
  }

  fetchSongs():  Observable<Song[]>{
    return this.songList.asObservable();
  }

  //Render fake data
  getFakeData(){
    this.http.get('assets/seed,sql', {responseType: 'text'})
      .subscribe(data => {
        this.sqlPorter.importSqlToDb(this.storage, data)
          .then( () => {
            this.getSongs();
            this.isDbReady.next(true);
          })
          .catch( error => console.error(error) );
      });
  }

  //Get list
  getSongs(){
    return this.storage.executeSql('SELECT * FROM songtable', [])
      .then( resp => {
        let items: Song[] = [];
        if( resp.rows.length > 0){
          for( let i = 0; i < resp.rows.length; i++){
            items.push({
              id: resp.rows.item(i).id,
              artist_name: resp.rows.item(i),
              song_name: resp.rows.item(i).song_name
            });
          }
        }
        this.songList.next(items);
      });
  }

  // Add
  addSong(artist_name, song_name) {
    let data = [artist_name, song_name];
    return this.storage.executeSql('INSERT INTO songtable (artist_name, song_name) VALUES (?, ?)', data)
    .then(res => {
      this.getSongs();
    });
  }
 
  // Get single object
  getSong(id): Promise<Song> {
    return this.storage.executeSql('SELECT * FROM songtable WHERE id = ?', [id]).then(res => { 
      return {
        id: res.rows.item(0).id,
        artist_name: res.rows.item(0).artist_name,  
        song_name: res.rows.item(0).song_name
      }
    });
  }

  // Update
  updateSong(id, song: Song) {
    let data = [song.artist_name, song.song_name];
    return this.storage.executeSql(`UPDATE songtable SET artist_name = ?, song_name = ? WHERE id = ${id}`, data)
    .then(data => {
      this.getSongs();
    })
  }

  // Delete
  deleteSong(id) {
    return this.storage.executeSql('DELETE FROM songtable WHERE id = ?', [id])
    .then(_ => {
      this.getSongs();
    });
  }


}

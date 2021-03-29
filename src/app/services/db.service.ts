import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song';


@Injectable({
  providedIn: 'root'
})
export class DbService {
  
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  songsList = new BehaviorSubject([]);

  constructor( private platform: Platform,
                private sqlite: SQLite,
                private http: HttpClient,
                private sqlitePorter: SQLitePorter ) { 
                  
                  const conn = this.createDatabase('song.db');
                  console.log("DB Connection: ",conn);
                }

  createDatabase(dbName?:string): Promise<SQLiteObject>{
    return this.platform.ready()
      .then((readySource: string) => {
        return this.sqlite.create({ 
          name: dbName || 'myDB.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
          return this.database;
        }).catch((error: Error) => {
          console.log('Error on open or create database: ', error);
          return Promise.reject(error.message || error);
        });  
    
      });  
  }

  getDbState(){
    return this.dbReady.asObservable();
  }

  getSongs(): Observable<Song[]>{
    return this.songsList.asObservable();
  }

  seedDatabase() {
    this.http.get( 'assets/songsScript.sql', {responseType: 'text'} )
    .subscribe( sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          console.log("script SEED lanzado");
          
          this.getSongs();
          this.dbReady.next(true);
        })
        .catch( console.error );
    });
  }

  // GET LIST
  loadSongs(){
    return this.database.executeSql( 'SELECT * FROM songtable', [] ).then( data => {
        let songs: Song[] = [];

        if(data.rows.length > 0){
          for(let i = 0; i < data.rows.length; i++){
            songs.push({
              id: data.rows.item(i).id,
              artist_name: data.rows.item(i).artist_name,
              song_name: data.rows.item(i).song_name 
            });
          }
        }
        this.songsList.next(songs);
      });
  }

  addSong(artist_name, song_name){
    let data = [artist_name, song_name];

    return this.database.executeSql( 'INSERT INTO songtable (artist_name, song_name) VALUES (?, ?)', data)
      .then( () => {
        this.loadSongs();
      })
      .catch(err => {
        console.log(err);
        
      });
  }

  getSong(id): Promise<Song>{
    return this.database.executeSql( 'SELECT * FROM songtable WHERE id = ?', id)
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
    return this.database.executeSql( `UPDATE songtable SET artist_name = ?, song_name = ?, WHERE id = ${id}`, data)
      .then( data => {
        this.loadSongs();
      });
  }

  deleteSong(id){
    return this.database.executeSql( 'DELETE FROM songtable WHERE id = ?', [id])
      .then( res => {
        this.loadSongs();
      });

  }


}

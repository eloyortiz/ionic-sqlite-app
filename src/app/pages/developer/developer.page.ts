import { DatabaseService, Developer } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
 
@Component({
  selector: 'app-developer',
  templateUrl: './developer.page.html',
  styleUrls: ['./developer.page.scss'],
})
export class DeveloperPage implements OnInit {

  public developer: Developer = null;
  public skills = '';
 
  constructor(
    private route: ActivatedRoute, 
    private db: DatabaseService, 
    private router: Router, 
    private toast: ToastController) { }
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let devId = params.get('id');
 
      this.db.getDeveloper(devId)
        .then(data => {
          this.developer = data;
          this.skills = this.developer.skills.join(',');
        });
    });
  }
 
  delete() {
    this.db.deleteDeveloper(this.developer.id)
      .then(_ => {
        this.router.navigateByUrl('/');
    });
  }
 
  updateDeveloper() {
    this.developer.skills = this.skills.split(',').map( skill => skill.trim() );
 
    this.db.updateDeveloper(this.developer)
      .then(async (res) => {
        let toast = await this.toast.create({
          message: 'Developer updated',
          duration: 1500,
          position: 'top'
        });
        toast.present();
      });
    
    this.router.navigateByUrl('/');
  }
}
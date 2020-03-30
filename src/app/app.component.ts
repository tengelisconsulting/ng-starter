import { Component } from '@angular/core';
import { AppLoadService } from './core/app-load.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'webapp';

  constructor(
    private appLoadService: AppLoadService,
  ) {
    this.init();
  }

  private async init(): Promise<void> {
    // all initialization logic should be triggered in this method
    await this.appLoadService.startupAttemptOnAppLoad();
  }

}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, timer, merge } from 'rxjs';
import { tap, flatMap, map, switchMap } from 'rxjs/operators';

import { memoize } from 'lodash';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../services/category.service';
import { BaseService } from '../../dstore/services/base.service';
import { StoreService } from '../../dstore-client.module/services/store.service';
import { AppService } from '../../services/app.service';
import { StoreJobType } from '../../dstore-client.module/models/store-job-info';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [
    trigger('dlcIn', [
      transition(':enter', [style({ width: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ width: 0 }))]),
    ]),
  ],
})
export class SideNavComponent implements OnInit {
  constructor(
    private sanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private storeService: StoreService,
    private appService: AppService,
  ) {}
  native = BaseService.isNative;
  @ViewChild('nav')
  nav: ElementRef<HTMLDivElement>;
  // category list
  cs$: Observable<Category[]>;
  // download count
  dc$: Observable<number>;

  ngOnInit() {
    this.cs$ = this.categoryService.list();
    this.dc$ = merge(
      timer(0, 5000).pipe(switchMap(() => this.storeService.getJobList())),
      this.storeService.jobListChange(),
    ).pipe(
      switchMap(jobs => this.storeService.getJobsInfo(jobs)),
      switchMap(jobs => {
        const apps = [].concat(
          ...jobs
            .filter(job => job.type === StoreJobType.install || job.type === StoreJobType.download)
            .map(job => job.names),
        );
        return this.appService.getApps(apps);
      }),
      map(apps => apps.length),
    );
  }

  mousewheel(event: WheelEvent) {
    const nav = this.nav.nativeElement;
    if (event.wheelDeltaY > 0) {
      if (nav.scrollTop === 0) {
        event.preventDefault();
      }
    } else {
      if (nav.scrollTop + nav.clientHeight === nav.scrollHeight) {
        event.preventDefault();
      }
    }
  }

  getStyle(icons: string[]) {
    return this.sanitizer.bypassSecurityTrustStyle(icons.map(url => `url(${url})`).join(','));
  }
}

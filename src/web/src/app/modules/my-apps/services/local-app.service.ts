import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { chunk } from 'lodash';

import { JobService } from 'app/services/job.service';
import { StoreService, Package } from 'app/modules/client/services/store.service';
import { StoreJobType } from 'app/modules/client/models/store-job-info';
import { environment } from 'environments/environment';
import { SoftwareService, Software } from 'app/services/software.service';

@Injectable({
  providedIn: 'root',
})
export class LocalAppService {
  metadataServer = environment.metadataServer;
  constructor(
    private jobService: JobService,
    private storeService: StoreService,
    private softwareService: SoftwareService,
  ) {}

  list({ pageIndex = 0, pageSize = 20 }) {
    return this.jobService.jobList().pipe(
      switchMap(() => this.storeService.InstalledPackages()),
      switchMap(async installed => {
        installed = installed.sort((a, b) => b.installedTime - a.installedTime);
        let list = chunk(installed, pageSize)[pageIndex].map(pkg => {
          const local_name = pkg.allLocalName[environment.locale] || pkg.allLocalName['en_US'] || pkg.packageName;
          return {
            name: pkg.appName,
            package: pkg,
            localName: local_name,
            info: { name: local_name, packages: [{ packageURI: pkg.packageURI }] },
            software: null as Software,
          };
        });
        try {
          const softs = await this.softwareService.list({
            names: list.map(app => app.name),
            filterPackage: false,
            filterStat: false,
          });
          const m = new Map(softs.map(soft => [soft.name, soft]));
          list.forEach(item => (item.software = m.get(item.name)));
        } catch {}
        return { total: installed.length, page: pageIndex, list };
      }),
    );
  }

  removingList() {
    return this.jobService.jobsInfo().pipe(
      map(jobs => {
        return jobs
          .filter(job => job.type === StoreJobType.uninstall)
          .map(job => job.names)
          .reduce((acc, names) => {
            acc.push(...names);
            return acc;
          }, []);
      }),
    );
  }

  removeLocal(soft: Software) {
    this.softwareService.remove(soft);
  }
}

import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getDataSourceSrv, getTemplateSrv, TemplateSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  ds: DataSourceApi | null = null;
  templateSrv: TemplateSrv;
  dsPromise: Promise<void | DataSourceApi>;
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.templateSrv = getTemplateSrv();
    console.log('DataSource constructor');
    this.dsPromise = getDataSourceSrv()
      .get(instanceSettings.jsonData.datasource)
      .then((result) => {
        this.ds = result;
        return result;
      })
      .catch((err) => console.log('Failed getting result', err));
  }

  query(request: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> | Observable<DataQueryResponse> {
    const noopFn = function (data: any) {
      return data;
    };
    var scriptStr = request.targets[0].postProcess;
    // eslint-disable-next-line no-eval
    var script = scriptStr ? eval(scriptStr) : noopFn;
    script = script.bind(request);

    if (this.ds == null) {
      throw 'Datasource to wrap not set, check config.';
    }

    request.targets.forEach((t) => {
      t.datasource = this.ds?.name;
      t.rawQuery = true;
    });

    const result = this.ds.query(request);
    if (result instanceof Observable) {
      return result.pipe(
        map((target) => {
          target.data = target.data.map((d) => script(d));
          return target;
        })
      );
    } else {
      return result.then((target) => {
        target.data = target.data.map((d) => script(d));
        return target;
      });
    }
  }

  async testDatasource() {
    await this.dsPromise;
    return this.ds?.testDatasource();
  }
}

import React, { ChangeEvent, PureComponent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from './types';
import { getDataSourceSrv } from '@grafana/runtime';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onDataSourceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      datasource: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;
    const datasources = getDataSourceSrv().getList({ pluginId: 'influxdb' });

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <label className="gf-form-label">Wrapped datasource</label>
          <select onChange={this.onDataSourceChange} value={jsonData.datasource}>
            {datasources.map((ds) => {
              return (
                <option key={ds.name} value={ds.name}>
                  {ds.name} ({ds.database})
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}

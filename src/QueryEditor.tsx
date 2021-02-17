import defaults from 'lodash/defaults';

import React, { PureComponent, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { TextArea } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  onQueryTextChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, query: event.currentTarget.value });
  };

  onPostProcessChange = (event: FormEvent<HTMLTextAreaElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, postProcess: event.currentTarget.value });
  };

  onKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === 'Enter' && event.ctrlKey) {
      this.props.onRunQuery();
    }
  };

  onFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === 'table') {
      this.props.query.resultFormat = 'table';
    } else {
      this.props.query.resultFormat = 'time_series';
    }
  };

  render() {
    const queryObj = defaults(this.props.query, defaultQuery);
    const { query, postProcess } = queryObj;

    return (
      <div>
        <div className="gf-form">
          <TextArea
            label="Query"
            css="gf-form-input"
            rows={3}
            placeholder="Query"
            value={query || ''}
            onChange={this.onQueryTextChange}
            onKeyPress={this.onKeyPress}
          />
        </div>
        <div className="gf-form">
          <TextArea
            label="Post processing"
            css="gf-form-input"
            rows={6}
            placeholder="Post processing"
            value={postProcess || ''}
            onChange={this.onPostProcessChange}
            onKeyPress={this.onKeyPress}
          />
        </div>
        <div className="gf-form">
          <label className="gf-form-label query-keyword">FORMAT AS</label>
          <select onChange={this.onFormatChange}>
            <option value="time_series">Time series</option>
            <option value="table">Table</option>
          </select>
        </div>
      </div>
    );
  }
}

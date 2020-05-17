import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'mobx-react-lite/batchingForReactDom';

import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app';

import 'services';

import './styles/global.pcss';

ReactDOM.render(<App />, document.getElementById('root'));

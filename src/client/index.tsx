import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import 'mobx-react-lite/batchingForReactDom'

import { App } from './app';

import 'services';

import './styles/global.pcss';

ReactDOM.render(<App />, document.getElementById('root'));

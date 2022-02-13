import {niceDate} from './base.js';

const weekControl = document.querySelector('input[type="week"]');
weekControl.value = niceDate(new Date())

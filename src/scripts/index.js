import Modernizr from 'modernizr';
import $ from 'jquery';

// Bootstrap component
import Alert from 'Alert';
import Button from 'Button';
import Carousel from 'Carousel';
import Collapse from 'Collapse';
import Dropdown from 'Dropdown';
import Modal from 'Modal';
import Popover from 'Popover';
import Scrollspy from 'Scrollspy';
import Tab from 'Tab';
import Tooltip from 'Tooltip';
import Util from 'Util';

// Components
import './components/test';

$(function () {
  $('[data-toggle="popover"]').popover()
})

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})



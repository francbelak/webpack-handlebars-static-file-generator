import $ from 'jquery';
import objectFitImages from 'object-fit-images';

import '../sass/main.scss';
import '../sass/critical.scss';

import '../assets/images/avatar.png';
import '../assets/images/favicon.ico';
import '../assets/images/svg/sample.svg';

import '../php/sendmail.php';

import '../templates/routes/index.handlebars';
import '../templates/routes/skills/index.handlebars';

$(document).ready(()=>{
  objectFitImages();
});

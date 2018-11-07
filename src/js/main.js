import $ from 'jquery';
import objectFitImages from 'object-fit-images';
import '../sass/critical.scss';
import '../assets/images/svg/sample.svg';

import '../php/sendmail.php';

import '../templates/routes/index.handlebars';
import '../templates/routes/skills/index.handlebars';

$(document).ready(()=>{
  objectFitImages();
});

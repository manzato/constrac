import { Template } from 'meteor/templating';

Template.registerHelper('formatDateTime', (date) => {
  if (date) {
    return "<span>" + moment( date ).format( 'MMMM Do, YYYY - HH:mm:ss' ) + "</span>";
  } else {
    return "";
  }
});

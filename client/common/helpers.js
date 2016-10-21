import { Template } from 'meteor/templating';

Template.registerHelper('formatDateTime', (date) => {
  if (date) {
    return "<span>" + moment( date ).format( 'MMMM Do, YYYY - HH:mm:ss' ) + "</span>";
  } else {
    return "N/A";
  }
});

Template.registerHelper('formatDate', (date) => {
  if (date) {
    return "<span>" + moment( date ).format( 'MMMM Do, YYYY' ) + "</span>";
  } else {
    return "N/A";
  }
});

Template.registerHelper('hideUnless', (test) => {
  return test ? {} : { style: 'display:none;' };
});


import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

  let current = 0;
  let goal = 0;
  let increments = 0;
  console.log('SIMULATION ON');

  Meteor.setInterval( () => {
    if (current >= goal) {
      current = 0;
      goal = 20 - Math.random() * 40;
      increment = Math.random();
    }
    const project = Projects.findOne({label:'Gui & Lu'});

    if (project) {
      const deviation = (project.deviation || 0) + increment;

      Projects.update({_id:project._id}, {$set:{deviation:deviation}});

      if (deviation < -20 || deviation > 20) {
        goal = 0;
        current = 0;
      }
    }
  }, 1000);
});

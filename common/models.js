import { Meteor } from 'meteor/meteor';

const addConstant = (clazz, name, value) => {
  Object.defineProperty(clazz, name, {
      value: value,
      writable : false,
      enumerable : true,
      configurable : false
  });
};

class Project {
  constructor(doc) {
    _.extend(this, doc);
  }

  getTopLevelTasks() {
    return Tasks.find({project_id:this._id, parent:null});
  }

  updateTasks() {
    const hours = {
      estimate: 0,
      actual: 0
    };

    this.getTopLevelTasks().forEach((task) => {
      task.updateTasks();

      try {
        hours.estimate += task.hours.estimate;
        hours.actual += task.hours.actual;
      } catch (e) {
        console.log('Failed to process ' + (task.hasChilds()?'node':'leaf') + ' ' + task.code + ':',e, task);
      }

      let progress = 0;
      if (!hours.estimate || !hours.actual) {
        progress = 0;
      } else {
        progress = (hours.actual / hours.estimate ) * 100;
      }
      Projects.update({ _id:this._id }, {
        $set: {
          progress:progress,
          hours:hours
        }
      });

      //Makes the hours available to in-memmory processes
      this.hours = hours;
    });
  }
};

addConstant(Project, 'STATE_CREATED', 'created');

class Task {
  constructor(doc) {
    _.extend(this, doc);
  }

  getChilds() {
    return Tasks.find({parent:this._id});
  }

  hasChilds() {
    return this.getChilds().count() > 0;
  }

  updateTasks() {
    console.log('Processing',(this.hasChilds()?'node':'leaf'),this.code);

    const hours = {
      estimate: 0,
      actual: 0
    };

    if (this.hasChilds()) {
      this.getChilds().forEach((task) => {
        task.updateTasks();

        try {
          hours.estimate += task.hours.estimate;
          hours.actual += task.hours.actual;
        } catch (e) {
          console.log('Failed to process ' + (task.hasChilds()?'node':'leaf') + ' ' + task.code + ':',e, task);
        }
      });

    } else {
      hours.estimate = this.hours.estimate;
      hours.actual = this.hours.actual;
    }

      let progress = 0;
      if (!hours.estimate || !hours.actual) {
        progress = 0;
      } else {
        progress = (hours.actual / hours.estimate ) * 100;
      }
      Tasks.update({ _id:this._id }, {
        $set: {
          progress:progress,
          hours:hours
        }
      });

      //Makes the hours available to in-memmory processes
      this.hours = hours;
  }
};

class AdvanceReport {
  constructor(doc) {
    _.extend(this, doc);
  }
};

Projects = new Meteor.Collection("projects", {
  transform: function(doc) {
    return new Project(doc);
  }
});
Projects.attachBehaviour('timestampable');

Projects.before.insert(function (userId, doc) {
  if (! doc.state ) {
    doc.state = Project.STATE_CREATED;
  }
  if (! doc.deviation ) {
    doc.deviation = 0;
  }
  if (! doc.progress ) {
    doc.progress = 0;
  }
});

Tasks = new Meteor.Collection("tasks", {
  transform: function(doc) {
    return new Task(doc);
  }
});
Tasks.attachBehaviour('timestampable');

AdvanceReports = new Meteor.Collection("advance-reports", {
  transform: function(doc) {
    return new AdvanceReport(doc);
  }
});
AdvanceReports.attachBehaviour('timestampable');

if (Meteor.isServer) {
  Meteor.startup( () => {
    Meteor.setInterval(() => {

      Projects.update({label:'test2'}, {$set:{deviation:20 - (40 * Math.random())}})

    }, 500);
  });
}

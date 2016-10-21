import { Meteor } from 'meteor/meteor';
import addConstant from '/imports/common/utils';
import Project from '/imports/common/project';
import Quote from '/imports/model/quote';
//import Logger from 'manzato/logging';

class Task extends EventEmitter {
  constructor(doc) {
    super();
    _.extend(this, doc);
    this._open = new ReactiveVar(false);
  }

  isOpen() {
    return this._open.get();
  }

  open() {
    console.log('Opening task');
    this._open.set(true);
    this.emit('open');
  }

  close() {
    console.log('Closing task');
    this._open.set(false);
    this.emit('close');
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

class ProgressReport {
  constructor(doc) {
    _.extend(this, doc);
  }
};

ProgressReports = new Meteor.Collection("progressReports", {
  transform: function(doc) {
    return new ProgressReport(doc);
  }
});

ProgressReports.attachBehaviour('timestampable');

Quotes = new Meteor.Collection("quotes", {
  transform: function(doc) {
    return new Quote(doc);
  }
});

Quotes.attachBehaviour('timestampable');

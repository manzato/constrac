import { Meteor } from 'meteor/meteor';
import toJSON from '/imports/model/utils';

const logger = Logger.getLogger('model:Task');

export default class Task extends EventEmitter {
  constructor(doc) {
    super();
    _.extend(this, doc);
    this._open = new ReactiveVar(false);
  }

  isOpen() {
    return this._open.get();
  }

  open() {
    logger.debug('Opening task');
    this._open.set(true);
    this.emit('open');
  }

  close() {
    logger.debug('Closing task');
    this._open.set(false);
    this.emit('close');
  }

  getChilds() {
    return Tasks.find({parent:this._id});
  }

  hasChilds() {
    return this.getChilds().count() > 0;
  }

  addChild(code, label, options = {}) {
    const project = Projects.findOne(this.project_id);

    return Task.create(project, code, label,
      _.extend(options, {
        parent_id: this._id
      })
    );
  }

  updateTasks() {
    logger.info('Processing',(this.hasChilds()?'node':'leaf'),this.code);

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
          logger.warn('Failed to process ' + (task.hasChilds()?'node':'leaf') + ' ' + task.code + ':',e, task);
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

  toJSON() {
    return toJSON(this,
      ['code', 'label', 'parent_id', 'project_id', 'isChild']
    );
  }

  save() {
    if (this._id) {
      Tasks.update({ _id:this._id }, { $set: this.toJSON() });
    } else {
      this._id = Tasks.insert( this.toJSON() );
    }
    return this;
  }

  update(fields) {
    Tasks.update({ _id:this._id }, { $set:fields });
    _.extend(this, fields);
  }
};

Task.create = (project, code, label, options = {}) => {
  check(code, String);
  check(label, String);

  return new Task(_.extend(options, {
    code:code,
    label:label,
    project_id: project._id
  })).save();
};


import addConstant from '/imports/common/utils';
import toJSON from '/imports/model/utils';
import Quote from '/imports/model/quote';
import Task from '/imports/model/task';
const logger = Logger.getLogger('common:project');

export default class Project {
  constructor(doc) {
    _.extend(this, doc);
  }

  getTopLevelTasks() {
    return Tasks.find({project_id:this._id, parent:null});
  }

  isStarted() {
    return this.state === Project.STATE_STARTED;
  }

  isPaused() {
    return this.state === Project.STATE_PAUSED;
  }

  isAtLeastStarted() {
    const value = this.isAtLeast(Project.STATE_STARTED);
    logger.trace("Is", this.state, "at least started? =>", value);
    return value;
  }

  isAtLeast(checkState) {
    check(checkState, String);
    if (_.isUndefined(this.state)) {
      logger.warn("Can't check the state of this project, since it is undefined!");
      return false;
    }
    switch(checkState) {
      case Project.STATE_STARTED:
        return !(this.state === Project.STATE_CREATED);
      default:
        return true;
    }
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
        logger.warn('Failed to process ' + (task.hasChilds()?'node':'leaf') + ' ' + task.code + ':',e, task);
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

  toJSON() {
    return toJSON(this, ['label', 'description', 'state']);
  }

  /* SERVER CODE ONLY!
  FIXME: How do I define a polymorphic server-client class (acts one way on
  the server, another on the client, with a common set of methods). Communicates
  via Meteor.Methods?
 */

  createQuote(label, description="", options) {
    return Quote.create(this, label, description, options);
  }


  addChild(code, label, options) {
    return Task.create(this, code, label, options);
  }

  getQuotes() {
    return Quotes.find({project_id:this._id});
  }

  removeQuotes() {
    Quotes.remove({project_id:this._id});
  }

  remove() {
    Quotes.remove({ project_id:this._id });
    Tasks.remove({ project_id:this._id });
    Projects.remove({ _id:this._id });
  }

  save() {
    if (this._id) {
      Projects.upsert({ _id:this._id }, { $set: this.toJSON() });
    } else {
      this._id = Projects.insert( this.toJSON() );
    }
    return this;
  }

  start(quote) {
    if (this.state !== Project.STATE_CREATED) {
      throw new Meteor.Error("Project not in created state");
    }

    const itemsToTasks = (items, parent) => {
      items.forEach((item) => {
        const target = parent || this;

        if (! item.code) {
          console.log("Non nice item", item);
          return;
        }
        const task = target.addChild(item.code, item.label);

        const childs = item.getChilds();

        itemsToTasks(childs , task);

        //We need this "isChild" field so that the client
        //may know how to render the node without subscribing to
        //the childs-sub
        task.update({
          isChild: childs.count() === 0
        });
      });
    };

    itemsToTasks(quote.getTopLevelItems());

    this.update({
      state:Project.STATE_STARTED,
      progress: 0,
      deviation: 0,
      startedAt: new Date()
    });
  }

  update(fields) {
    Projects.update({ _id:this._id }, { $set:fields });
    _.extend(this, fields);
  }
};

Project.create = function(label, description="", options = {}) {
  return new Project(_.extend(options, {
    label:label,
    description:description,
    state:Project.STATE_CREATED
  })).save();
};

addConstant(Project, 'STATE_CREATED', 'created');
addConstant(Project, 'STATE_STARTED', 'started');
addConstant(Project, 'STATE_PAUSED', 'paused');

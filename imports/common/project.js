
import addConstant from '/imports/common/utils';
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

  isAtLeast(state) {
    check(state, String);
    if (_.isUndefined(this.state)) {
      logger.warn("Can't check the state of this project, since it is undefined!");
      return false;
    }
    switch(state) {
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
};

addConstant(Project, 'STATE_CREATED', 'created');
addConstant(Project, 'STATE_STARTED', 'started');
addConstant(Project, 'STATE_PAUSED', 'paused');


import ProjectController from '/imports/client/controller/project_controller';
import Project from '/imports/model/project';

ProjectInfoController = ProjectController.extend({

  startProject: function() {
    //FIXME: Send this logic to the server
    const project = this.data();

    Projects.update({ _id:project._id },
      {
        $set: { state:Project.STATE_STARTED, startedAt:new Date() }
      }
    );
  },

  restartProject: function() {
    //FIXME: Send this logic to the server
    const project = this.data();

    Projects.update({ _id:project._id },
      {
        $set: { state:Project.STATE_STARTED }
      }
    );
  },

  pauseProject: function() {
    //FIXME: Send this logic to the server
    const project = this.data();

    Projects.update({ _id:project._id },
      {
        $set: { state:Project.STATE_PAUSED }
      }
    );
  }
});

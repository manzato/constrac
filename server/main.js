import { Meteor } from 'meteor/meteor';

const addTask = function(taskDefinition, childs) {
  const id = Tasks.insert(_.extend(taskDefinition, {
    isChild: !childs
  }));

  _.each(childs, function(child) {
    Tasks.update({_id:child._id}, {$set:{parent:id}});
  });
  return Tasks.findOne({_id:id});
};


Meteor.startup(() => {

  if (true) {
    return;
  }
  const project = Projects.findOne({label:'Gui & Lu'});

  if (project) {
    Tasks.remove({project_id:project._id});
    Projects.remove({_id:project._id});
  }

  const projectId = Projects.insert({
    label:'Gui & Lu',
    description: 'Construccion de casa unifamiliar de 324m'
  });

  addTask({project_id:projectId, code: '1', label:'Subsuelo'}, [
    addTask({project_id:projectId, code: '1.1', label:'Armado general de vigas'}, [
      addTask({project_id:projectId, code: '1.1.1', label:'Vigas fundación', hours: {estimate:10, actual:1 }}),
      addTask({project_id:projectId, code: '1.1.2', label:'Vigas perimetrales', hours: {estimate:10, actual:1 }}),
      addTask({project_id:projectId, code: '1.1.3', label:'Columnas', hours: {estimate:10, actual:9 }}),
      addTask({project_id:projectId, code: '1.1.4', label:'Encadenados', hours: {estimate:10, actual:10 }})
    ]),
    addTask({project_id:projectId, code: '1.2', label:'Replanteo', hours: {estimate:10, actual:1 }}),
    addTask({project_id:projectId, code: '1.3', label:'Nivelado', hours: {estimate:10, actual:1 }}),
    addTask({project_id:projectId, code: '1.4', label:'colocación de polietileno', hours: {estimate:10, actual:1 }}),
    addTask({project_id:projectId, code: '1.5', label:'colocación de vigas'}, [
      addTask({project_id:projectId, code: '1.5.1', label:'Vigas fundación', hours: {estimate:10, actual:1 }}),
      addTask({project_id:projectId, code: '1.5.2', label:'Vigas perimetrales', hours: {estimate:10, actual:1 }})
    ]),
    addTask({project_id:projectId, code: '1.6', label:'Posición de columnas', hours: {estimate:10, actual:1 }}),
    addTask({project_id:projectId, code: '1.7', label:'Encofrado perimetral', hours: {estimate:10, actual:1 }}),
    addTask({project_id:projectId, code: '1.8', label:'Llenado de platea', hours: {estimate:10, actual:1 }})
  ]);

  addTask({project_id:projectId, code: '2', label:'Planta baja'}, [
    addTask({project_id:projectId, code: '2.1', label:'Subsuelo 1.1',hours: {estimate:100, actual:1 }}),
    addTask({project_id:projectId, code: '2.2', label:'Subsuelo 1.2',hours: {estimate:20, actual:20 }})
  ]);

  const top = Tasks.find({project_id:projectId, parent:null}).map(function(task) {
    return task._id;
  });

  Projects.update({_id:projectId}, {$set:{ tasks:top }});

  Projects.findOne({_id:projectId}).updateTasks();
});

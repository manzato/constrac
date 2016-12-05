
import Project from '/imports/common/project';
import './dynamic_menu.html';

const createSubMenuItem = (name, currentName, label, urlContext) => {
  const item = createMenuItem(name, currentName, label, urlContext);
  item.subitem = true;
  return item;
};

const createMenuItem = (name, currentName, label, urlContext) => {
  const route = Router.routes[name];

  check(route, Function);

  const active = name === currentName;

  const url = active?'#':route.url(urlContext);

  return {
    label: label,
    url: url,
    active: active
  }
};

Template.DynamicMenu.onCreated( function() {
  const project = this.data;
  const state = project.state;
  const self = this;

  this.autorun(() => {
    const currentName = Router.current().route.getName();
    self.menuItems = [];

    const urlContext = {
      projectId: project._id
    };
    self.menuItems.push(
      createMenuItem('ProjectInfo', currentName, 'Detalles', urlContext)
    );

    if (project.isAtLeast(Project.STATE_STARTED)) {
      self.menuItems.push(
        createMenuItem('ProgressReports', currentName, 'Reportes de avance', urlContext)
      );
      self.menuItems.push(
        createMenuItem('ProjectTasks', currentName, 'Tareas', urlContext)
      );
    }

    if (project.state === Project.STATE_CREATED) {
      self.menuItems.push(
        createMenuItem('ProjectQuotes', currentName, 'Cotizaciones', urlContext)
      );

      if (currentName == 'QuoteEdit') {
        console.log(currentName);
        self.menuItems.push(
          createSubMenuItem('QuoteEdit', currentName, 'QE', urlContext)
        );
      }
    }
  });


  //this.state.set('routes', );
});

Template.DynamicMenu.helpers({
  menuItems: function() {
    return Template.instance().menuItems;
  }
});

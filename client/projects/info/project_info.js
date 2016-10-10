import { Template } from 'meteor/templating';
import './project_info.html';
import Gauge from '/imports/client/charts/gauge.js';

var gauges = [];

function createGauge(name, label, min, max) {
  const config = {
    size: 120,
    label: label,
    min: undefined != min ? min : 0,
    max: undefined != max ? max : 100,
    minorTicks: 5
  }

  const range = config.max - config.min;
  config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
  config.redZones = [{ from: config.min + range*0.9, to: config.max }];

  const gauge = new Gauge(name + "GaugeContainer", config);
  gauge.render();

  return gauge;
}

function createDeviationGauge(name, label, range) {

  const min = -1 * (range / 2);
  const max = (range / 2);

  const config = {
    size: 120,
    label: label,
    min: min,
    max: max,
    minorTicks: 5
  };

  const yellowRange = 0.40;
  const redRange = 0.20;

  config.redZones = [
    { from: config.min, to: config.min + range * redRange},
    { from: config.min + range* (1-redRange), to: config.max }
  ];

  config.yellowZones = [
    { from: config.min + range * redRange, to: config.min + range * yellowRange },
    { from: config.min + range * (1-yellowRange), to: config.min + range * (1-redRange)}
  ];

  config.greenZones = [
    { from: config.min + range * yellowRange, to: config.min + range * (1-yellowRange)}
  ];

  const gauge = new Gauge(name + "GaugeContainer", config);
  gauge.render();

  return gauge;
};

Template.project_info.onCreated( function() {
  const projectId = FlowRouter.getParam("projectId");
  const template = this;

  this.subscribe('project-single', projectId, {
    onReady: () => {
      template.autorun( () => {
        const project = Projects.findOne({ _id:projectId }, { fields: { deviation:1 }});
        template.deviationGauge.redraw(project.deviation);
      });
    }
  });
});

Template.project_info.onRendered( function() {
  this.deviationGauge = createDeviationGauge("deviation", "Desviación", 50);
});

Template.project_info.helpers({
  project: function() {
    const instance = Template.instance();
    if (! instance.project) {
       instance.project = Projects.findOne({ _id:FlowRouter.getParam("projectId") });
    }
    return instance.project;
  },
  side_bar_items: () => {
    return [
      {label:'Detalles', url:'info',  active:true},
      {label:'Reportes diarios', url:'progress-reports'},
      {label:'Tareas', url:'tasks'}
    ];
  }
});

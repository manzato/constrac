
const logger = Logger.getLogger("startup");

Meteor.startup(() => {
  logger.info("Starting constract");
});

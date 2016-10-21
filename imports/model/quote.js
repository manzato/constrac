
const logger = Logger.getLogger('model:quote');

export default class Quote {
  constructor(doc) {
    _.extend(this, doc);
  }
};

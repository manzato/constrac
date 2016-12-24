
const logger = Logger.getLogger('model:quote');
import toJSON from '/imports/model/utils';
import QuoteItem from '/imports/model/quote_item';

export default class Quote {
  constructor(doc) {
    _.extend(this, doc);
  }

  toJSON() {
    return toJSON(this, [
      'label', 'description', 'project_id'
    ]);
  }

  getTopLevelItems() {
    return QuoteItems.find({
      quote_id: this._id, parent_id: null
    });
  }

  addChild(label, other) {
    const code = "" + (QuoteItems.find({
      quote_id:this._id, $or: [
        {parent_id: null},
        {parent_id: { "$exists":false }}
      ]}
    ).count() + 1);

    logger.debug("Adding quote item >" + label + "< ->", code);

    return QuoteItem.create(
      this,
      code,
      label
    );
  }

  save() {
    if (this._id) {
      Quotes.upsert({ _id:this._id }, { $set: this.toJSON() });
    } else {
      this._id = Quotes.insert( this.toJSON() );
    }
    return this;
  }

  freeze() {
    logger.info("Freezing quote >" + this.label + "<");
  }

};

Quote.create = (project, label, description, options = {}) => {
  //check(project, Object);
  check(label, String);
  check(description, String);

  return new Quote(_.extend(options, {
    label:label,
    description:description,
    project_id: project._id
  })).save();
};

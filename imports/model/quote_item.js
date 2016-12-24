
const logger = Logger.getLogger('model:QuoteItem');
import toJSON from '/imports/model/utils';

const generateCode = (quote_id, parent_id = "") => {
  check(quote_id, String);
  check(parent_id, String);

  const filter = { quote_id:quote_id };
  let prefix = "";
  if (parent_id) {
    filter.parent_id = parent_id;
    prefix = QuoteItems.findOne({ _id:parent_id }).code + ".";
  } else {
    filter.parent_id = { "$exists":false };
  }

  return prefix + (QuoteItems.find( filter ).count() + 1);
};

export default class QuoteItem {
  constructor(doc) {
    _.extend(this, doc);
  }

  toJSON() {
    return toJSON(this, ['code', 'label', 'parent_id', 'project_id', 'quote_id']);
  }

  save() {
    if (this._id) {
      QuoteItems.update({ _id:this._id }, { $set: this.toJSON() });
    } else {
      this._id = QuoteItems.insert( this.toJSON() );
    }
    return this;
  }

  addChild(label, other) {
    check(label, String);

    const code = generateCode(this.quote_id, this._id);

    logger.debug("Adding quote subitem >" + label + "< ->", code);

    const quote = Quotes.findOne({ _id:this.quote_id });

    return QuoteItem.create(quote, code, label, {
      project_id:this.project_id,
      parent_id: this._id
    });
  }

  getChilds() {
    return QuoteItems.find({ project_id:this.project_id, parent_id:this._id});
  }
};

QuoteItem.create = (quote, code, label, other = {}) => {

  const doc = _.extend({}, other, {
    code:code,
    label:label,
    quote_id: quote._id,
    project_id: quote.project_id
  });

  return new QuoteItem(doc).save();
};

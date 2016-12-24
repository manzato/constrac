
export default function toJSON(object, properties) {

  const json = {};
  _.each(properties, (property) => {
    if (_.isString(property)) {
      json[property] = object[property];
    } else {
      console.err("Property is not a String. Implement!!!");
    }
  });

  if (object._id) {
    json._id = object._id;
  }
  return json;
};

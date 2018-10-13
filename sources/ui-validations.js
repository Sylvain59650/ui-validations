function getId(input) {
  if (input.id) { return input.id };
  input.id = input.name;
  return input.name;
}

function addMsg(input, msg, cssClass) {
  var label = newElement("label", { id: getId(input) + "_msg", for: getId(input), class: "field-validation " + cssClass }, msg);
  input.afterEnd(label);
  Positionizer.setRelativePosition(input, label, "bottom-left");
  input.addClass(cssClass);
}



function removeMsg(input) {
  var id = getId(input) + "_msg";
  var label = qsi(id);
  if (label !== null) {
    label.remove(label);
  }
  input.class("-info -warning -error");
}

function cleanErrors() {
  qsa(".field-validation").remove();
  qsa(".error").class("-info -warning -error");
}

function addError(input, msg) {
  addMsg(input, msg, "error");
}

function addWarning(input, msg) {
  addMsg(input, msg, "warning");
}

function addInfo(input, msg) {
  addMsg(input, msg, "info");
}

var dico = {
  required: function() { return !validators.isEmpty(...arguments); }
};

function validate(constraints) {
  var err = 0;
  cleanErrors();
  for (var constraint of constraints) {
    var field = qsi(constraint.field);
    if (field === null) {
      field = qsn(constraint.field);
    }
    if (field !== null) {
      var value = field.val();
      for (var rule of constraint.rules) {
        if (rule.type === "custom") {
          if (!rule.fn(value)) {
            addError(field, rule.msg);
            err++;
            break;
          }
        } else if (dico[rule.type]) {
          var fn = dico[rule.type];
          if (!fn(value)) {
            addError(field, rule.msg);
            err++;
            break;
          }
        } else {
          console.error("rule " + rule.type + " undefined");
        }
      }
    } else {
      console.error("field " + constraint.field + " not found");
    }
    return err === 0;
  }
}
exports.addMsg = addMsg;
exports.addInfo = addInfo;
exports.addWarning = addWarning;
exports.addError = addError;
exports.removeMsg = removeMsg;
exports.validate = validate;
exports.cleanErrors = cleanErrors;
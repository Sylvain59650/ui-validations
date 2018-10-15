var config = {
  placement: "bottom-left",
  MSGS: {
    required: "Le champ [[name]] est requis",
    minlength: "Le champ [[name]] doit comporter au moins [[]] caractères"
  }
}


function getId(input) {
  if (input.id) { return input.id };
  input.id = input.name;
  return input.name;
}

function addMsg(input, msg, cssClass) {
  if (config.placement === "tooltip") {
    input.oldTitle = input.title;
    input.title = msg;
  } else {
    var label = newElement("label", { id: getId(input) + "_msg", for: getId(input), class: "field-validation " + cssClass }, msg);
    input.afterEnd(label);
    Positionizer.setRelativePosition(input, label, "bottom-left");
  }
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
  qsa(".error").class("-info -warning -error").attr("title", "");
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

function addErrorRule(input, rule) {
  var msg = getMsg(input, rule);
  addError(input, msg);
}

function getMsg(field, rule) {
  if (rule.msg) { return rule.msg };
  var msg = "";
  var labelField = qs("[for='" + field.name + "']");
  if (config.MSGS[rule.type]) {
    msg = config.MSGS[rule.type];
  } else {
    msg = "error";
  }
  var fieldName = (labelField != null) ? labelField.text() : "";
  msg = msg.replace("[[name]]", fieldName);
  return msg;
}

function not(fn) {
  return !fn(arguments[1], arguments[2]);
}

validators.required = function() { return not(validators.isEmpty, ...arguments); }

function validateConstraint(constraint) {
  var err = 0;
  var field = qsi(constraint.field);
  if (field === null) {
    field = qsn(constraint.field);
  }
  if (field !== null) {
    var value = field.val();
    for (var rule of constraint.rules) {
      var fn = validators[rule.type];
      if (!!fn) {
        if (!fn(value, rule)) {
          addErrorRule(field, rule);
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

  return err;
}

function validate(constraints) {
  var err = 0;
  cleanErrors();
  for (var constraint of constraints) {
    err += validateConstraint(constraint);
  }
  return err === 0;
}
exports.addMsg = addMsg;
exports.addInfo = addInfo;
exports.addWarning = addWarning;
exports.addError = addError;
exports.removeMsg = removeMsg;
exports.validate = validate;
exports.cleanErrors = cleanErrors;
exports.config = config;
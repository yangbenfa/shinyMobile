// color picker input binding
var f7ColorPickerBinding = new Shiny.InputBinding();

$.extend(f7ColorPickerBinding, {

  initialize: function(el) {
    app.colorPicker.create({
      inputEl: el,
      targetEl: $(el).attr("id") + '-value',
      targetElSetBackgroundColor: true,
      modules: colorPickerModules,
      // I keep openIn default to auto since
      // it is better to be automatically optimized
      // based on the currently selected device.
      openIn: 'auto',
      sliderValue: colorPickerSliderValue,
      sliderValueEditable: colorPickerSliderValueEditable,
      sliderLabel: colorPickerSliderLabel,
      hexLabel: colorPickerHexLabel,
      hexValueEditable: colorPickerHexValueEditable,
      groupedModules: colorPickerGroupedModules,
      // Same thing here. For now, we use predefined
      // palettes. latter, maybe add user defined palettes
      palette: colorPickerPalettes,
      //formatValue: function (value) {
      //  return 'rgba(' + value.rgba.join(', ') + ')';
      //},
      value: {
        hex: colorPickerValue,
      },
    });
  },

  find: function(scope) {
    return $(scope).find(".color-picker-input");
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    var ID = $(el).attr("id");
    // below we get the hidden value field using
    // vanilla JS
    return document.getElementById(ID).value;
  },

  // see updateF7Slider
  setValue: function(el, value) {
    //$(el).data('immediate', true);
    app.colorPicker.setValue($(el)).value;
  },

  // see updateF7Slider
  receiveMessage: function(el, data) {

  },

  subscribe: function(el, callback) {
    $(el).on("change.f7ColorPickerBinding ", function(e) {
      callback();
    });
  },

  unsubscribe: function(el) {
    $(el).off(".f7ColorPickerBinding ");
  }
});

Shiny.inputBindings.register(f7ColorPickerBinding);


// date input binding
var f7DateBinding = new Shiny.InputBinding();

$.extend(f7DateBinding, {
  find: function(scope) {
    return $(scope).find(".date-input");
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    console.log($(el).attr("value"));
    return $(el).attr("value");
  },

  // see updateF7Calendar
  setValue: function(el, value) {

  },

  // see updateF7Calendar
  receiveMessage: function(el, data) {

  },

  subscribe: function(el, callback) {
    $(el).on('keyup.dateInputBinding input.dateInputBinding', function(event) {
      // Use normal debouncing policy when typing
      callback(true);
    });
    $(el).on("change.f7DateBinding", function(e) {
      callback(false);
    });
  },

  getRatePolicy: function() {
    return {
      policy: 'debounce',
      delay: 250
    };
  },

  unsubscribe: function(el) {
    $(el).off(".f7DateBinding");
  }
});

Shiny.inputBindings.register(f7DateBinding);


// date picker input binding
var f7DatePickerBinding = new Shiny.InputBinding();

$.extend(f7DatePickerBinding, {

  initialize: function(el) {
    var date = $(el).attr("placeholder");
    if (date === undefined) {
      date = new Date();
    }
    app.calendar.create({
      //containerEl: ".container-calendar",
      //inputReadOnly: false,
      multiple: false,
      dateFormat: 'yyyy-mm-dd',
      inputEl: el,
      value: [date]
    });
    $(el).click();
    app.calendar.close();
  },

  find: function(scope) {
    return $(scope).find(".calendar-input");
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    // below we have an issue with the returned month. Apparently,
    // months start from 0 so when august is selected, it actually
    // returns july. Need to increment by 1.
    var value = $(".calendar-day-selected").attr("data-date");
    value = value.split("-");
    n = parseInt(value[1]) + 1;
    if (value[2] < 10) {
      value = value[0] + "-0" + n + "-0" + value[2];
    } else {
      value = value[0] + "-0" + n + "-" + value[2];
    }
    return value;
    //return app.calendar.get($(el)).value;
  },

  // see updateF7Calendar
  setValue: function(el, value) {
    app.calendar.setValue($(el)).value;
  },

  // see updateF7Calendar
  receiveMessage: function(el, data) {

  },

  subscribe: function(el, callback) {
    $(el).on("change.f7DatePickerBinding", function(e) {
      callback();
    });
  },

  unsubscribe: function(el) {
    $(el).off(".f7DatePickerBinding");
  }
});

Shiny.inputBindings.register(f7DatePickerBinding);


// picker input binding
var f7PickerBinding = new Shiny.InputBinding();

$.extend(f7PickerBinding, {

  initialize: function(el) {

    var inputEl = $(el)[0];

    // recover the inputId passed in the R function
    var id = $(el).attr("id");
    // function to convert a string to variable
    function SetTo5(inputId, varString) {
      var res = eval(inputId + "_" + varString);
      return res;
    }

    // vals is a global variable defined in the UI side.
    // It contains an array of choices to populate
    // the picker input.
    var p = app.picker.create({
      inputEl: inputEl,
      rotateEffect: true,
      cols: [
        {
          textAlign: 'center',
          values: SetTo5(id, "vals")
        }
      ],
      value: SetTo5(id, "val"),
      on: {
        // need to trigger a click
        // close the picker to initiate it properly but need Timeout
        // otherwise the picker cannot open anymore
        init: function(picker) {
          picker.open();
          setTimeout(function() {picker.close();}, 10);
        },
        open: function(picker) {

        },
        close: function(picker) {

        }
      }
    });
    inputEl.f7Picker = p;
  },

  find: function(scope) {
    return $(scope).find(".picker-input");
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    var p = app.picker.get($(el));
    return p.cols[0].value;
    //return app.picker.getValue(el);
  },

  // see updateF7Picker
  setValue: function(el, value) {
    var p = app.picker.get($(el));
    // value must of length 1
    if (value.length == 1) {
      p.cols[0].value = value;
      p.cols[0].displayValue = value;
      p.displayValue[0] = value;
      p.value[0] = value;
      p.open();
      setTimeout(function() {p.close();}, 10);
    }
  },

  // see updateF7Picker
  receiveMessage: function(el, data) {
    var p = app.picker.get($(el));
    // update placeholder
    if (data.hasOwnProperty('choices')) {
      p.cols[0].values = data.choices;
    }
    // Update value
    if (data.hasOwnProperty('value')) {
      this.setValue(el, data.value);
    }
  },

  subscribe: function(el, callback) {
    $(el).on("change.f7PickerBinding", function(e) {
      callback();
    });
  },

  unsubscribe: function(el) {
    $(el).off(".f7PickerBinding");
  }
});

Shiny.inputBindings.register(f7PickerBinding);



// slider input binding
var f7SliderBinding = new Shiny.InputBinding();

$.extend(f7SliderBinding, {

  initialize: function(el) {
    app.range.create({el: el});
  },

  find: function(scope) {
    return $(scope).find(".range-slider");
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    return app.range.get($(el)).value;
  },

  // see updateF7Slider
  setValue: function(el, value) {
    app.range.setValue(el, value);
  },

  // see updateF7Slider
  receiveMessage: function(el, data) {
    // create a variable to update the range
    var r = app.range.get($(el));
    if (data.hasOwnProperty('min')) {
      r.min = data.min;
    }
    if (data.hasOwnProperty('max')) {
      r.max = data.max;
    }
    if (data.hasOwnProperty('scale')) {
      if (data.scale == "true") {
        data.scale = true;
      } else {
        data.scale = false;
      }
      r.scale = data.scale;
    }
    r.updateScale();

    // important: need to update the scale before
    // updating the value. Otherwise the value will
    // be diplayed in the old scale, which is weird...
    if (data.hasOwnProperty('value')) {
      // handle the case where the updated slider
      // switch from a dual value to a single value slider.
      var val = data.value;
      if ($.isArray(val)) {
        this.setValue(el, val);
      } else {
        r.dual = false;
        r.updateScale();
        this.setValue(el, val);
      }
    }
  },

  subscribe: function(el, callback) {
    $(el).on("range:change.f7SliderBinding", function(e) {
      callback(true);
    });
  },

  unsubscribe: function(el) {
    $(el).off(".f7SliderBinding");
  },

  // The input rate limiting policy
  getRatePolicy: function() {
    return {
      // Can be 'debounce' or 'throttle'
      policy: 'debounce',
      delay: 250
    };
  }
});

Shiny.inputBindings.register(f7SliderBinding);



// stepper input binding
var f7StepperBinding = new Shiny.InputBinding();

$.extend(f7StepperBinding, {

  initialize: function(el) {

    // recover the inputId passed in the R function
    var id = $(el).attr("id");
    // function to convert a string to variable
    function SetTo5(inputId, varString) {
      var res = eval(inputId + "_" + varString);
      return res;
    }

    // create the stepper to access API
    app.stepper.create({
      el: el,
      wraps: SetTo5(id, "stepperWraps"),
      autorepeat: SetTo5(id , "stepperAutoRepeat"),
      autorepeatDynamic: SetTo5(id, "stepperAutoRepeatDynamic"),
      manualInputMode: SetTo5(id, "stepperManualInputMode")
    });

    // add readonly attr if the stepper is initially
    // not in manual mode
    if (!SetTo5(id, "stepperManualInputMode")) {
      var inputTarget = $(el).find('input');
      $(inputTarget).attr('readonly', '');
    }
  },

  find: function(scope) {
    return $(scope).find(".stepper");
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    return app.stepper.get($(el)).value;
  },

  // see updateF7Stepper
  setValue: function(el, value) {
    app.stepper.setValue(el, value);
  },

  // the 2 methods below are needed by incrementF7Stepper
  // and decrementF7Stepper
  increment: function() {
    app.stepper.increment();
  },

  decrement: function() {
    app.stepper.decrement();
  },

  // see updateF7Stepper
  receiveMessage: function(el, data) {
    // create a variable to update the stepper
    var s = app.stepper.get($(el));

    // for some reason, we need to update both
    // min and params.min fields
    if (data.hasOwnProperty('min')) {
      s.min = data.min;
      s.params.min = data.min;
    }
    // for some reason, we need to update both
    // max and params.max fields
    if (data.hasOwnProperty('max')) {
      s.max = data.max;
      s.params.max = data.max;
    }
    if (data.hasOwnProperty('wraps')) {
      s.params.wraps = data.wraps;
    }

    // handle the readOnly property
    if (data.hasOwnProperty('manual')) {
      s.params.manualInputMode = data.manual;
      var inputTarget = $(el).find('input');
      if (data.manual) {
        if (typeof $(inputTarget).attr('readonly') !== typeof undefined) {
          $(inputTarget).removeAttr('readonly');
        }
      } else {
        $(inputTarget).attr('readonly', '');
      }
    }
    // for some reason, we need to update both
    // step and params.step fields
    if (data.hasOwnProperty('step')) {
      s.step = data.step;
      s.params.step = data.step;
    }

    // this does not work
    if (data.hasOwnProperty('autorepeat')) {
      s.params.autorepeat = data.autorepeat;
      s.params.autorepeatDynamic = data.autorepeat;
    }

    // CSS properties
    if (data.hasOwnProperty('rounded')) {
      if (data.rounded) {
        $(el).addClass("stepper-round");
      } else {
        $(el).removeClass("stepper-round");
      }
    }
    if (data.hasOwnProperty('raised')) {
      if (data.raised) {
        $(el).addClass('stepper-raised');
      } else {
        $(el).removeClass('stepper-raised');
      }
    }
    if (data.hasOwnProperty('color')) {
      $(el).removeClass (function (index, className) {
        return (className.match (/(^|\s)color-\S+/g) || []).join(' ');
      });
      $(el).addClass('color-' + data.color);
    }

    // stepper size
    if (data.hasOwnProperty('size')) {
      if ($(el).hasClass('stepper-small') || $(el).hasClass('stepper-large')) {
        if ($(el).hasClass('stepper-small') && data.size == "large") {
          $(el).removeClass('stepper-small');
          $(el).addClass('stepper-large');
        } else if ($(el).hasClass('stepper-large') && data.size == "small") {
          $(el).addClass('stepper-small');
          $(el).removeClass('stepper-large');
        }
      } else {
        if (data.size == "small") {
          $(el).addClass('stepper-small');
        } else if (data.size == "large") {
          $(el).addClass('stepper-large');
        }
      }
    }

    // Update value
    if (data.hasOwnProperty('value')) {
      this.setValue(el, data.value);
      s.params.value = data.value;
    }
  },

  subscribe: function(el, callback) {
    $(el).on('stepper:change.f7StepperBinding', function(e) {
      // no need to debounce here
      // except if autorepeat is set
      // then we send the value once
      // the + or - buttons is released
      var s = app.stepper.get($(el));
      if (s.params.autorepeat) {
        callback(true);
      } else {
        callback();
      }
    });
  },

  unsubscribe: function(el) {
    $(el).off('.f7StepperBinding');
  },

  // The input rate limiting policy
  getRatePolicy: function() {
    return {
      // Can be 'debounce' or 'throttle'
      policy: 'debounce',
      delay: 500
    };
  }
});

Shiny.inputBindings.register(f7StepperBinding);




// tabs binding
var f7TabsBinding = new Shiny.InputBinding();

$.extend(f7TabsBinding, {

  find: function(scope) {
    return $(scope).find(".tabsBindingTarget").siblings();
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    console.log($(el).filter(".tab-active").attr("data-value"));
    return $(el).filter(".tab-active").attr("data-value");
  },

  // see updateF7Tabs
  setValue: function(el, value) {

  },

  // see updateF7Tabs
  receiveMessage: function(el, data) {
    // create a variable to update the range
  },

  subscribe: function(el, callback) {
    $(el).on("change.f7TabsBinding", function(e) {
      callback();
    });
  },

  unsubscribe: function(el) {
    $(el).off(".f7TabsBinding");
  }
});

Shiny.inputBindings.register(f7TabsBinding);




// toggle input binding
var f7ToggleBinding = new Shiny.InputBinding();

$.extend(f7ToggleBinding, {

  initialize: function(el) {
    app.toggle.create({el: el});
  },

  find: function(scope) {
    return $(scope).find(".toggle");
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    return app.toggle.get($(el)).checked;
  },

  // see updateF7Toggle
  setValue: function(el, value) {
    var t = app.toggle.get($(el));
    t.checked = value;
  },

  // see updateF7Toggle
  receiveMessage: function(el, data) {
    if (data.hasOwnProperty("checked")) {
      this.setValue(el, data.checked);
    }
    if (data.hasOwnProperty("color")) {
      $(el).removeClass (function (index, className) {
    return (className.match (/(^|\s)color-\S+/g) || []).join(' ');
});
      $(el).addClass("color-" + data.color);
    }
  },

  subscribe: function(el, callback) {
    $(el).on("toggle:change.f7ToggleBinding", function(e) {
      // no need to debounce here
      callback();
    });
  },

  unsubscribe: function(el) {
    $(el).off(".f7ToggleBinding");
  }
});

Shiny.inputBindings.register(f7ToggleBinding);

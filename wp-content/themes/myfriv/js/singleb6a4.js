/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/10/16
 *
 * @author Blair Mitchelmore
 * @version 1.1.2
 *
 **/
jQuery.fn.extend({
  everyTime: function(interval, label, fn, times, belay) {
    return this.each(function() {
      jQuery.timer.add(this, interval, label, fn, times, belay);
    });
  },
  oneTime: function(interval, label, fn) {
    return this.each(function() {
      jQuery.timer.add(this, interval, label, fn, 1);
    });
  },
  stopTime: function(label, fn) {
    return this.each(function() {
      jQuery.timer.remove(this, label, fn);
    });
  }
});

jQuery.event.special

jQuery.extend({
  timer: {
    global: [],
    guid: 1,
    dataKey: "jQuery.timer",
    regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
    powers: {
      'ms': 1,
      'cs': 10,
      'ds': 100,
      's': 1000,
      'das': 10000,
      'hs': 100000,
      'ks': 1000000
    },
    timeParse: function(value) {
      if (value == undefined || value == null)
        return null;
      var result = this.regex.exec(jQuery.trim(value.toString()));
      if (result[2]) {
        var num = parseFloat(result[1]);
        var mult = this.powers[result[2]] || 1;
        return num * mult;
      } else {
        return value;
      }
    },
    add: function(element, interval, label, fn, times, belay) {
      var counter = 0;

      if (jQuery.isFunction(label)) {
        if (!times)
          times = fn;
        fn = label;
        label = interval;
      }

      interval = jQuery.timer.timeParse(interval);

      if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
        return;

      if (times && times.constructor != Number) {
        belay = !!times;
        times = 0;
      }

      times = times || 0;
      belay = belay || false;

      var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

      if (!timers[label])
        timers[label] = {};

      fn.timerID = fn.timerID || this.guid++;

      var handler = function() {
        if (belay && this.inProgress)
          return;
        this.inProgress = true;
        if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
          jQuery.timer.remove(element, label, fn);
        this.inProgress = false;
      };

      handler.timerID = fn.timerID;

      if (!timers[label][fn.timerID])
        timers[label][fn.timerID] = window.setInterval(handler,interval);

      this.global.push( element );

    },
    remove: function(element, label, fn) {
      var timers = jQuery.data(element, this.dataKey), ret;

      if ( timers ) {

        if (!label) {
          for ( label in timers )
            this.remove(element, label, fn);
        } else if ( timers[label] ) {
          if ( fn ) {
            if ( fn.timerID ) {
              window.clearInterval(timers[label][fn.timerID]);
              delete timers[label][fn.timerID];
            }
          } else {
            for ( var fn in timers[label] ) {
              window.clearInterval(timers[label][fn]);
              delete timers[label][fn];
            }
          }

          for ( ret in timers[label] ) break;
            if ( !ret ) {
              ret = null;
              delete timers[label];
            }
          }

          for ( ret in timers ) break;
            if ( !ret )
              jQuery.removeData(element, this.dataKey);
          }
        }
      }
    });

jQuery(window).bind("unload", function() {
  jQuery.each(jQuery.timer.global, function(index, item) {
    jQuery.timer.remove(item);
  });
});

jQuery(document).ready( function($) {
  $('body').oneTime( myfrivsingle.time * 1000, function() {
    $('.preloader').hide();
    $('.game').show();
  });

  $(".skip").click(function(){
    $('.preloader').hide();
    $('.game').show();
  });

  $(document).keyup( function(e){
    if( e.keyCode==27 )
      $(".lgtbxbg-pofi").fadeOut(150)
  });

  $(".lgtbxbg-pofi").click( function(e) {
    e.preventDefault();
    $(".lgtbxbg-pofi").fadeOut(150)
  });

  $(".trnlgt").click( function(e) {
    e.preventDefault();
    $(".lgtbxbg-pofi").fadeIn(150)
  });

  $(".lgtbxbg-pofi").css("opacity",0.7);
});

/**
 * Adopt game dimensions to current screen size
 */
jQuery(document).ready( function($) {
  var game_width;
  var game_height;
  var game_ratio;   /* Game height/width ratio */
  var resized;      /* Set true if the game has been resized */
  var game;         /* Game object */

  /**
   * Resize game object
   *
   * @version 1.2.0
   * @since   1.2.0
   * @return  void
   */
  function game_resize() {
    // Get the new body width
    var new_width = $(".container").width();
    // Add some space (for frames or borders)
    var check_width = parseInt(game_width);

    // Check defined width
    if ( new_width <= 984 && new_width >= 759 ) {
      new_width = 690;
    }

    // Check if the body width is smaller than the game
    // If so, resize the game
    if ( new_width <= check_width  ) {
      game.attr("width", parseInt(new_width) );
      game.attr("height", (parseInt(new_width) ) * game_ratio);
      resized = true;
    }
    else {
      if ( resized ) {
        // Resize back
        game.attr("width", game_width);
        game.attr("height", game_height);
        resized = false;
      }
    }
  }

  /**
   * Determinate game dimensions
   * Search for a game object and try to get dimension informatino
   *
   * @version 1.2.0
   * @since   1.2.0
   * @return  void
   */
  function determinate_dimension() {
    // Set elemtets to search for
    search = $("embed, iframe, object");
    game = $("#myarcade_game").find( search );
    game_width = game.attr("width");
    game_height = game.attr("height");
    game_ratio = game_height / game_width;
  }

  // Bind resize event with the resize function
  $(window).resize( function(event) {
    game_resize();
  });

  // Initial call
  determinate_dimension();
  game_resize();
});
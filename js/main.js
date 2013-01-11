
var MOBILE_THRESHOLD_PX = 700;

var rpc = function(url, func) {
  $.ajax({
    url: 'views/' + url + '.json',
    type: 'GET',
    dataType: 'json',
    data: '',
    success: func,
    failure: function() {
      alert('Unable to contact server, =(');
    }
  });
};

var onArticleArrived = function(data) {
  $('#main > article').html(data.html).prepend('<h2>' + data.title + '</h2>');
};

// Detect iOS browsers.
if (navigator.userAgent.indexOf('iPhone') >= 0 || navigator.userAgent.indexOf('iPad') >= 0) {
	$('html').addClass('ios');
}

function openReadingPanel(page) {
  var readingPanel = $('#main');
  window.location.hash = page;
  rpc(page, onArticleArrived);

  $('#main > article').html('Loading...');

  var width = $(window).width();

  // Mobile browsers (handle window size event)
  var top = '49px';
  if (width < MOBILE_THRESHOLD_PX) {
    top = 0;
    $('#main article').css({
      width: (width - 145) + 'px'
    });
    $('#main').css({
      right: 0,
      'overflow-y': 'visible',
      'overflow-x': 'visible'
    });
  }

  readingPanel.css('top', -$(window).height())
      .show()
      .animate({
        top: '55px'
      });
}

$(function() {

  var articles = $('#index > .index');
  articles.html('');
  // Fetch the index right away.
  rpc('nav', function(data) {
    $('#left').html(data.html);
  });

  // Look to see if this is a direct link and open the linked page if it is.
  var path = window.location.hash;
  if (path) {
    path = path.slice(path.lastIndexOf('#') + 1);
    if (path && path != '') {
      openReadingPanel(path);
    }
  } else {
    window.location.hash = '#home';
  }

  $('.searchbox').focus(function() {
    $(this).val('To be implemented');
  }).blur(function() {
    $(this).val('Search');
  });

  $('#index article h3').live('click', function() {
    window.location.hash = $(this).parent().attr('page-id');
    return false;
  });

  $('#link-about').click(function() {
    window.location.hash = 'about';
    return false;
  });
  $('#link-projects').click(function() {
    window.location.hash = 'projects';
    return false;
  });

  // Reverse animation for back-link
  $('#link-back').click(function() {
    var width = $(window).width();
    $('#main').animate({
      left: width
    });
    $('#main h1.accent').fadeOut('fast');
    window.location.hash = '';
    return false;
  });

  // Hover effects.
  $('#main article > h1').live('mouseenter', function() {
    $('#main article time').fadeIn();
  }).live('mouseleave', function() {
    $('#main article time').fadeOut();
  });

  var target = $('#index > h2');
  var originalText = target.text();
  $('#index > h1').live('mouseenter', function() {
    target.fadeOut('slow', function() {
      target.text('A website by Dhanji R. Prasanna').fadeIn('slow');
    })
  }).live('mouseleave', function() {
    target.fadeOut(200, function() {
      target.text(originalText).fadeIn();
    });
  });

  // Reflow content to fit in mobile browsers:
  var windowWidth = parseInt($(window).width());
  if (windowWidth < MOBILE_THRESHOLD_PX) {
    $('header').css({
      position: 'static',
      right: 0
    });
    $('#index').css({
      position: 'static',
      left: 0
    });
    $('#index .index').css({
      width: 'auto',
      height: 'auto',
      '-webkit-column-count': 0
    });
    $('#index article').css({
      width: '100%'
    });
    $('body').css('overflow-y', 'auto');
  }

  $(window).hashchange(function() {
    var page = location.hash;
    if (page.length > 0 && page.charAt(0) == '#') {
      page = page.slice(1);
    }
    if (!page || page == '') {
      // Go home.
      openReadingPanel('home');
    } else {
      openReadingPanel(page);
    }
  });

});

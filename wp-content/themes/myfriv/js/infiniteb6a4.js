jQuery(document).ready( function($) {
  var count = 2;
  var win = $(window);

  win.scroll(function() {
    if ($(document).height() - win.height() == win.scrollTop()) {
      if (count > myfrivinfinite.total ){
        $('a#inifiniteLoaderEnd').show('fast').delay( 1000 ).hide('slow');
        return false;
      }
      else{
        loadArticle( count );
        if (loadArticle){
          count++;
        }
      }
    }
  });

  function loadArticle( pageNumber ){
    $('a#inifiniteLoader').show('fast');
    $.ajax({
      url: myfrivinfinite.ajaxurl,
      type:'POST',
      data: "action=infinite_scroll&page_no="+ pageNumber,
      success: function(html){
        $('a#inifiniteLoader').hide('1000');
        var $content = $(html);
        myfriv_grid.append($content).masonry( 'appended', $content );
        return true;
      }
    });
    return false;
  }
});
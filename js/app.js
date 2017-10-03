var requestTimeOut;
var clickedBeer;

$('#helpBlock').hide();
$('#queryInput').focus();

$('#queryForm').submit(search);

$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 500);
  });
}

var beersList = $('.beers-list ul');

function search(event) {
  event.preventDefault();

  beersList.empty();

  var beerQuery = $(this).find('#queryInput').val();

  if (beerQuery) {
    var beerQueryEncoded = encodeURI(beerQuery);
    var url = 'https://quiet-inlet-67115.herokuapp.com/api/search/all?q=' + beerQueryEncoded;

    var request = $.getJSON(url)
      .done(onQuerySuccess)
      .fail(onError);

    requestTimeOut = setTimeout(function() { request.abort(); }, 2000);
  }

  $(this).find('#queryInput').val('');
}

function onQuerySuccess(json) {
  clearTimeout(requestTimeOut);

  $('#helpBlock').hide();
  if (json.length <= 0) {
    $('#helpBlock').show();
    return null;
  }

  json.forEach(function (beer) {
    var randomBackgroundColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 === #ffffff;
    var beerNotFoundImage = 'https://dummyimage.com/256x256/' + randomBackgroundColor + '/ffffff&text=' + beer.name.split(' ').join('+');
    var beerImage = beer.labels ? beer.labels.medium : beerNotFoundImage;
    var newBeerElement = $('<li id="' + beer.id + '"><a data-beer-id="' + beer.id + '" href="#" class="thumbnail"><img src="' + beerImage + '"></a></li>');

    beersList.append(newBeerElement);
  });
}

function onError(err) {
  clearTimeout(requestTimeOut);

  $('#helpBlock').show();

  console.error('>> request error: ', err.statusText);
}

function onQueryIdSuccess(json) {
  clearTimeout(requestTimeOut);

  $('#helpBlock').hide();
  if (json.length <= 0) {
    $('#helpBlock').show();
    return null;
  }

  var name = json.nameDisplay || 'no name';
  var description = json.style ? json.style.description : 'no description';

  $('li .captionBeer').remove();
  //var beerDescription = $('<li class="descBeer"><div class="captionBeer beer-' + json.id + '"><h3>' + name + '</h3><p class="text-justify">' + description + '</p></div></li>');
  var beerDescription = $('<div class="captionBeer beer-' + json.id + '"><h3>' + name + '</h3><p class="text-justify">' + description + '</p></div>');
  //if ($('li.descBeer .beer-' + json.id).length <= 0)
  if ($('.captionBeer.beer-' + json.id).length <= 0)
    $(clickedBeer).append(beerDescription);

  //$('#descBeer').scrollView();
}

$(document).on('click', '.beers-list a', function(event) {
  event.stopPropagation();

  $('#helpBlock').hide();

  var beerId = $(this).data('beer-id');
  clickedBeer = $(this).parent();

  if (!beerId) {
    $('#helpBlock').show();
    return null;
  }

  var url = 'https://quiet-inlet-67115.herokuapp.com/api/beer/' + beerId;

  var request = $.getJSON(url)
    .done(onQueryIdSuccess)
    .fail(onError);

  requestTimeOut = setTimeout(function() { request.abort(); }, 2000);
});

// $(window).on('load', 'img', function(){
//   console.log(this);
// });

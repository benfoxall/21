
// ------ THE SOLUTION FINDER

// a couple of FPish array enhancements

// gives a new array with value pushed on it
Array.prototype.$push = function(v){
  var a = this.slice();
  a.push(v);
  return a;
}

// gives the array without selected indexes
Array.prototype.$remove = function(inds){
  var a = [];
  for(var i = 0; i < this.length; i++){
    var keep = true;
    for(var k in inds){
      if(inds[k] == i){
        keep = false;
        break;
      }
    }
    keep && a.push(this[i]);
  }
  return a;
}

var operators = '+ - / *'.split(' ');

// All the ways that the cards can be combined
solutions = function(cards, cb){
  if(cards.length == 1){
    cb(cards[0]);
  }

  for(var i = 0; i < cards.length; i++){
    for(var j = i + 1; j < cards.length; j++){
      var rest = cards.$remove([i,j]);
      for(var o = 0; o < operators.length; o++){
        var applied = ['(', cards[i], operators[o], cards[j], ')'].join(' ');
        solutions(rest.$push(applied), cb);
      }

    }
  }
}

var select_ids = ['card-1','card-2','card-3','card-4'];

var check = function(){
    var cards = [];
    for (var i=0; i < select_ids.length; i++) {
        cards[i] = parseInt(document.getElementById(select_ids[i]).innerHTML,0);
    }

  document.getElementById('results').innerHTML = '';
  solutions(cards, function(solution){
    //check if the solution reaches 21
    if(eval(solution) === 21) {
      document.getElementById('results').innerHTML += ('<li>' + solution + '</li>');
    }
  });
}


// -----------


$(function(){
  
  $('#random').click(function(){
      $('.card').each(function(){
         var value = Math.min(Math.ceil(Math.random()*14), 10);
         
         // u - g - l -y
         var cardname = value;
         if(value == 1){
             cardname = 'A';
         }
         if(value == 10){
             cardname = ['J', 'Q', 'K'][Math.floor(Math.random()*3)];
         }
         
         $(this).data('value', value).find('h2').text(cardname);
      });
  });
  
  $('#clear').click(function(){
      $('.card').data('value',0).find('h2').text('');
  });
  
  $('#choice li').click(function(e){
      e.preventDefault();
      var v = $(this).text();
      $('.card').each(function(){
          if(!$(this).data('value')){
              $(this).data('value',v).find('h2').text(v);
              return false;
          }
      });
      
  });
  
  $('#choice li, #clear, #random').click(function(){
      var filled = !$('#cards li:empty').size();
      $('#show-solution').attr('disabled',!filled).text('Find Solutions');
      $('#results').hide();

  });
  
  $('#show-solution').click(function(){
      $('#results').hide();
      if($(this).text() == 'Find Solutions'){
          
          check();
          
          var count = $('#results li').size();

          $(this).text(count + ' Solution' + (count == 1 ? '' : 's') + ' (show)');
          
      } else {
          $('#results').show();
      }
      
  });
  
  $('#show-choice').click(function(){
      $('#choice').toggle();
  }).click();
  
  
});
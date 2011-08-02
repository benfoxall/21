
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
permutations = function(cards, cb){
  if(cards.length == 1){
    cb(cards[0]);
  }

  for(var i = 0; i < cards.length; i++){
    for(var j = i + 1; j < cards.length; j++){
      var rest = cards.$remove([i,j]);
      for(var o = 0; o < operators.length; o++){
        var applied = ['(', cards[i], operators[o], cards[j], ')'].join(' ');
        permutations(rest.$push(applied), cb);
      }

    }
  }
}


var find_solutions = function(cards){
	var sols = [];
	permutations(cards, function(solution){
		//check if the solution reaches 21
		if(eval(solution) === 21) {
			sols.push(solution);
		}
	});
	return sols;
}


// -----------

$(function(){
	
    //a helper to set the content of a card
    $.fn.card = function(v){
        this.each(function(){
            $(this).html(v + '<span class="flip">' + v + '</span>').data('value',v);
        })
    }
    
    $('.cards > li').each(function(){
        $(this).card($(this).text());
    });

	
	$('.multiple .cards').each(function(){
	    $('li', this).each(function(i){
            $(this).css({position:'absolute',marginLeft:i + 'em',zIndex:100-i});
	    });
	});
	
    $('#options > li').click(function(){
        var v = $(this).data('value');
        if(v == 'random'){
            $('#table li').each(function(){
                $(this).card(Math.ceil(Math.random()*10))
            });
            
            $('#options').removeClass('active');
        } else {
            var remaining = $('#table li:has(.flip:empty)');
            if(remaining.size() == 1){
                $('#options').removeClass('active');
            }
            remaining.first().card(v);
        }
    });
    
    $('nav a').click(function(e){
        e.preventDefault();
        var selector = $(this).attr('href');
        
        $(selector).toggleClass('active')
                .siblings().removeClass('active');
    });
    $('nav a[href=#options]').click(function(){
        $('#table li').card('');
    });
    $('nav a[href=#solutions]').click(function(){
		
		$('#solutions').empty();
		
		var cards = [];
		$('#table li').each(function(){
			cards.push(parseInt($(this).data('value'),10) || 0);
		});
		
		var sols = find_solutions(cards);
		$.each(sols, function(k,s){
			$('#solutions').append('<li>' + s + '</li>');
		});
		if(sols.length == 0){
			$('#solutions').html('<li>no solutions</li>');
		}
    })
})
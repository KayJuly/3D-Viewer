$(function () {

	// navigation design
	$('#modal-gui2').append($('.dg'));
	$('#modal-gui1').append($('.main').first());
	$('.dg').css('display', 'block');
	$('.close-button').attr('hidden', true);
	$('#navigation').css({'width': '300px'});
	$('#menu').css({'marginLeft': '300px'});

	// navigation open/close
	$('.menuicon').on('click',function() {
		if ($('#navigation').css('width') > '0px') {
			$('#navigation').css({'width': '0px'});
			$('#menu').css({'marginLeft': '0px'});
		} else {
			$('#navigation').css({'width': '300px'});
			$('#menu').css({'marginLeft': '300px'});
		}
	});

	// navigation sub-title click
	var links = $('.sub-title');
	links.on('click', function () {
		var item = this.nextElementSibling;
		if ($(item).css('display') === 'block') {
			$(item).css('display', 'none');
		} else {
			$(item).css('display', 'block');
		}	
	});

	// navigation plusBtn click
	$('#plusBtn').on('click',function() {
		if (guiObj2.Perspective < 4) return;
		guiObj2.Perspective = guiObj2.Perspective - 2;
	});

	// navigation minusBtn click
	$('#minusBtn').on('click',function() {
		if (guiObj2.Perspective > 160) return;
		guiObj2.Perspective = guiObj2.Perspective + 5;
	});

	// navigation reloadBtn click
	$('#reloadBtn').on('click',function() {
		window.location.reload();	
	});

	// navigation fullscreenBtn click
	$('#fullscreenBtn').on('click',function() {
		$('body').fullscreen();
	});
	
});

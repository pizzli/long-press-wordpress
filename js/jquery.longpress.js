/*
 *  Project: Long Press
 *  Description: Pops a list of alternate characters when a key is long-pressed
 *  Author: Quentin Thiaucourt, http://toki-woki.net
 */

;(function ($, window, undefined) {
    
    var pluginName = 'longPress',
        document = window.document,
        defaults = {/*
	        propertyName: "value"
        */};

	var moreChars={
		'a':'àæáâãäåαª',
		'A':'AÀ',
		'e':'éèêëε€',
		'u':'ùúûüμυ',
		'y':'ýÿ',
		'i':'ìíîïι',
		'o':'òóôõöø',
		'$':'£¥€₩₨₳Ƀ'
	};
	var ignoredKeys=[8, 13, 37, 38, 39, 40];

	var selectedCharIndex;
	var lastWhich;
	var timer;
	var activeElement;

	var popup=$('<ul class=long-press-popup />');

	$(window).mousewheel(onWheel);

	function onKeyDown(e) {

		// Arrow key with popup visible
		if ($('.long-press-popup').length>0 && (e.which==37 || e.which==39)) {
			if (e.which==37) activePreviousLetter();
			else if (e.which==39) activateNextLetter();

			e.preventDefault();
			return;
		}

		if (ignoredKeys.indexOf(e.which)>-1) return;
		activeElement=e.target;

		if (e.which==lastWhich) {
			e.preventDefault();
			if (!timer) timer=setTimeout(onTimer, 10);
			return;
		}
		lastWhich=e.which;
	}
	function onKeyUp(e) {

		if (ignoredKeys.indexOf(e.which)>-1) return;

		lastWhich=null;
		clearTimeout(timer);
		timer=null;
		if (selectedCharIndex>-1) {
			updateChar();
			selectedCharIndex=-1;
		}
		hidePopup();
	}
	function onTimer() {
		var typedChar=$(activeElement).attr('value').split('')[getCaretPosition(activeElement)-1];

		if (moreChars[typedChar]) {
			showPopup((moreChars[typedChar]));
		} else {
			hidePopup();
		}
	}
	function showPopup(chars) {
		popup.empty();
		var letter;
		for (var i=0; i<chars.length; i++) {
			letter=$('<li class=long-press-letter />').text(chars[i]);
			letter.mouseenter(activateLetter);
			popup.append(letter);
		}
		$('body').append(popup);
		selectedCharIndex=-1;
	}
	function activateLetter(e) {
		selectCharIndex($(e.target).index());
	}
	function activateRelativeLetter(i) {
		selectCharIndex(($('.long-press-letter').length+selectedCharIndex+i) % $('.long-press-letter').length);
	}
	function activateNextLetter() {
		activateRelativeLetter(1);
	}
	function activePreviousLetter() {
		activateRelativeLetter(-1);
	}
	function hidePopup() {
		popup.detach();
	}
	function onWheel(e, delta, deltaX, deltaY) {
		if ($('.long-press-popup').length==0) return;
		e.preventDefault();
		delta<0 ? activateNextLetter() : activePreviousLetter();
	}
	function selectCharIndex(i) {
		$('.long-press-letter.selected').removeClass('selected');
		$('.long-press-letter').eq(i).addClass('selected');
		selectedCharIndex=i;
	}

	function updateChar() {
		var newChar=$('.long-press-letter.selected').text();
		var pos=getCaretPosition(activeElement);
		var arVal=$(activeElement).attr('value').split('');
		arVal[pos-1]=newChar;
		$(activeElement).attr('value', arVal.join(''));
		setCaretPosition(activeElement, pos);
	}

    function LongPress( element, options ) {

        this.element = element;
		this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

	LongPress.prototype = {

		init: function () {
			$(this.element).keydown(onKeyDown).keyup(onKeyUp);
        }

	};

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new LongPress( this, options ));
            }
        });
    };

}(jQuery, window));
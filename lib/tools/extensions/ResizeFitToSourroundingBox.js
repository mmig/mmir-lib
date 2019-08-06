define(['jquery'], function($){

/**
 * This function iterates over all elements of a specific class and
 * changes the font-size of the contained text to the maximal
 * possible size - while still being small enough to fit in the
 * element.
 *
 * @function
 * @param {String}
 *            class_name Name of the class which inner text should
 *            be fitted to the size of the element
 *
 * @requires jQuery
 * @public
 * @memberOf mmir.ExtendedCommonUtils.prototype
 */
function resizeFitToSourroundingBox(class_name) {
	// resize the font in box_fit-class, so that it won't overlap its div-box
	$(function() {

		var smallest_font = 1000;
		$(class_name).each(function(i, box) {
			var width = $( box ).width(),
						html = '<span style="white-space:nowrap">',
						line = $( box ).wrapInner( html ).children()[ 0 ],
						n = parseInt($( box ).css('font-size'), 10);

					$( box ).css( 'font-size', n );

					while ( $( line ).width() > width ) {
						$( box ).css( 'font-size', --n );
					}

					$( box ).text( $( line ).text() );

					n = parseInt($( box ).css('font-size'), 10);

			if (n < smallest_font) {
				smallest_font = n;
			}
		});

		$(class_name).each(function(i, box) {
			$(box).css('font-size', smallest_font);
		});
	});
}

return resizeFitToSourroundingBox;

})

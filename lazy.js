/* lazy.js v1.0
 *
 * This code snippet is designed to improve page speed (load time) performance by deferring the load of appropriately
 * tagged resources.  To defer the load of an image until it would appear in the viewport, insert the following HTML
 * in the page:
 *
 *    <a href="LINK" [target="_blank"] data-defer="view" data-img-src="SRC" data-img-alt="ALT" data-img-width="WIDTH" data-img-height="HEIGHT" />
 *
 *    -- OR --
 *
 *    <span data-defer="view" data-img-src="SRC" data-img-alt="ALT" data-img-width="WIDTH" data-img-height="HEIGHT" />
 *
 * Embed the <a> tag version if the image to be loaded should be linked (the image will be inserted into the <a> tags). 
 * Embed the <span> tag version if the image does not need to be linked.  Either will result in the insertion of the
 * following inside the containing tags:
 *
 *    <img src="SRC" alt="ALT" width="WIDTH" height="HEIGHT" border="0" />
 * 
 * To ensure graceful failure when JavaScript is disable, we recommend that the tags you embed (<a> or <span>) contain
 * approriate text or HTML that is representative of the image to be loaded (similar to the image's 'alt' attribute).  
 * This content will be replaced by the image when the image loads.
 * 
 * 
 * Dependencies:
 * 
 * This code is dependent on jQuery.  It is known to be compatible with versions as early as 1.2.6.  It has not been tested on all versions.
 * 
 * 
 * Developer: Zebulon Young, O'Reilly Media, Inc.
 */

( function( $ ) {
	// Makes this code compatible with versions of jQuery prior to 1.4 by back-filling $.proxy.
	if ( typeof $.proxy == 'undefined' ) {
		$.proxy = function( callback, context ) {
			var proxy = function() {
				callback.apply( context, arguments );
			}
		
			return proxy;
		};
	}
	
	var vController = function() {
		this.init();
	};
	
	vController.prototype = {
		init: function() {
			var that = this;
			var s = $( '[data-defer="view"]' );
			
			// Applies the specified width and height to the container of the deferred image, to ensure that the images
			// eventual location is correctly measured within the document for comparison to the current viewport.
			s.each( function() {
				var t = $( this ), p = t.parent(), w = Number( t.attr( "data-img-width" ) ), h = Number( t.attr( "data-img-height" ) );
				p.css( { width: w, height: h } );
			});
		
			this.objs = [];
			var w = $( window ), top = w.scrollTop(), bottom = top + w.height(), i;
			
			// Gather's the deferred objects' data into an array.
			s.each( function() {
				var t = $( this ), p = t.parent(), off = p.offset();
				var o = {
					a: t,
					p: p,
					top: off.top,
					bottom: off.top + p.innerHeight()
				};
				
				if ( o.top < bottom && o.bottom > top ) {
					that.load( o );
				}
				else {
					that.objs.push( o );
				}
			});
			
			// Binds the controller's scroll function to the window's scroll event.
			$( window ).scroll( $.proxy( this.scroll, this ) );
		},
		
		// Called on 'scroll' event, this function determines which deferred images are entering
		// the viewport and initiates their load.
		scroll: function() {
			var w = $( window ), top = w.scrollTop(), bottom = top + w.height(), i;
			
			for ( i = this.objs.length - 1; i >= 0; i-- ) {
				if ( this.objs[i].top < bottom ) {
					this.load( this.objs[i] );
				}
			}
		},
		
		// Inserts the image into the DOM when the image resource has loaded.
		load: function( o ) {
			var t = o.a;
			var c = $( "<img />" );
			var f = function() { t.html( c ); };
		
			c.load( f );
			c.attr( "src", t.attr( "data-img-src" ) );
			c.attr( "alt", t.attr( "data-img-alt" ) );
			c.attr( "border", 0 );
		}
	};
	
	$( function() {
		var vC = new vController();
	})
}) ( jQuery );
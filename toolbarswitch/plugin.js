/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview The "toolbarswitch" plugin profides the ability use a
 *               different  (larger) toolbar when the editor is maximized.  
 *               
 *               Add the toolbar for maximized mode by:
 *                   CKEDITOR.replace('sometextcomponent', { toolbar: 'yoursmalltoolbarname', maximizedToolbar: 'yourbigtoolbarname' });
 *               
 *               Requires:
 *                - patch on panelbutton plugin.js from ticket 7280 to Store/Restore a copy of the panel definition.
 *                - Patch on maximize plugin to fix null error on 'var buttonNode' that only occurs when switching toolbars.
 *               
 *               TODO:
 *                - fix the buttons that no longer function after switching the toolbar:
 *                  . the 4 text alignment buttons (center, left, right, fill)
 *                  . the smiley button
 *                  . 3 of the text style buttons (strike, superscript, subscript)
 *                  . the quote block button
 *                  . the link and unlink buttons
 *                  . the horizontal line button
 *                  . the table button
 *                  . the image button
 *                  
 *               Inspired by http://stackoverflow.com/questions/12531002/change-ckeditor-toolbar-dynamically
 */

(function() {
	
	CKEDITOR.editor.prototype.loadToolbar = function(tbName) {
		// If the 'themeSpace' event doesn't exist, load the toolbar plugin
		if ( !this._.events.themeSpace ) {
			CKEDITOR.plugins.registered.toolbar.init(this);
			// causes themeSpace event to be listened to.
		}
		// If a different toolbar was specified use it, otherwise just reload
		if ( tbName ) this.config.toolbar = tbName;

		// themeSpace event returns a object with the toolbar HTML in it
		var obj = this.fire( 'uiSpace', { space: 'top', html: '' } );

		// Replace the toolbar HTML 
		var tbEleId = this.ui.spaceId( 'top' );
		var tbEle = document.getElementById(tbEleId);
		tbEle.innerHTML = obj.html;
	}

})();

CKEDITOR.plugins.add( 'toolbarswitch', {
	requires: [ 'button', 'toolbar' ],
	
	init: function( editor ) {
		var _initialToolbar = editor.config.toolbar;
	
		editor.on( 'beforeCommandExec', function( ev ) {
			if ( ev.data.name == 'maximize' ) {
				if ( editor.config.toolbar == _initialToolbar ) {
					editor.loadToolbar( editor.config.maximizedToolbar );
				} else {
					editor.loadToolbar( _initialToolbar );
				}
			}
		});
	}
});

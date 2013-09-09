/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview  Plugin that changes the toolbar and maximizes the editor 
 *                for the big toolbar.
 * 
 *                You need a custom config to define the small and big toolbars.
 *                Also the maximize plug-in is needed but not the maximize button.
 *                For this plugin you should use the 'Toolbarswitch' button instead.
 * 
 *                CKEDITOR.replace('sometextcomponentname', {
 *               		customConfig: '/...custom_ckeditor_config.js'
 *               		toolbar: 'yoursmalltoolbarname', 
 *               		smallToolbar: 'yoursmalltoolbarname',
 *               		maximizedToolbar: 'yourbigtoolbarname' });
 *               
 *                Requires JQuery
 */


function switchMe(editor, callback) {

	var origCustomConfig = editor.config.customConfig;
	var origContentCss = editor.config.contentCss;
	var origExtraPlugins = editor.config.extraPlugins;

	var origToolbar =  editor.config.toolbar;
	var origSmallToolbar = editor.config.smallToolbar;
	var origMaximizedToolbar = editor.config.maximizedToolbar;
	var newToolbar;
	if (origToolbar == origSmallToolbar) {
		newToolbar = origMaximizedToolbar;
	} else {
		newToolbar = origSmallToolbar;
	}
	
	// Copy data to original text element before getting rid of the old editor
	var data = editor.getData();
	var domTextElement = editor.element.$;
	jQuery(domTextElement).val(data);
	
	// Remove old editor and the DOM elements, else you get two editors
	var id = domTextElement.id;
	CKEDITOR.remove(editor);
	jQuery('#cke_' + id).remove();

	CKEDITOR.replace(id, {
		customConfig : origCustomConfig,
		contentsCss : origContentCss,
		toolbar : newToolbar,
		smallToolbar: origSmallToolbar,
		maximizedToolbar: origMaximizedToolbar,
		extraPlugins : origExtraPlugins,
		on: {
			instanceReady: function(e) {
				CKeditor_OnComplete(e.editor);
				if (callback) {
					callback.call(null, e);
				}
			}
		}
	});
}

CKEDITOR.plugins.add('toolbarswitch', {
	requires: [ 'button', 'toolbar', 'maximize' ],

	init: function (editor) {

		var commandFunction = {
			exec: function( editor ) {
				if ( editor.config.toolbar == editor.config.maximizedToolbar ) {
					// For switching to the small toolbar first minimize
					editor.commands.maximize.exec();
					switchMe(editor, function(e){
						var newEditor = e.editor;
						newEditor.fire('triggerResize');
					});
				} else {
					switchMe(editor, function(e){
						var newEditor = e.editor;
						newEditor.commands.maximize.exec();
						newEditor.fire('triggerResize');
					});
				}
			}
		}

		var command = editor.addCommand( 'toolbarswitch', commandFunction );
		command.modes = { wysiwyg:1,source:1 };
		command.canUndo = false;
		command.readOnly = 1;

		editor.ui.addButton && editor.ui.addButton( 'Toolbarswitch', {
			label: 'Toolbarswitch',
			command: 'toolbarswitch',
			toolbar: 'tools',
			icon: CKEDITOR.skin.path() + 'icons/maximize.png'
		});
	}
});


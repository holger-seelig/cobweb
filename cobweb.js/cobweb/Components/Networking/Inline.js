/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the Cobweb Project.
 *
 * Cobweb is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * Cobweb is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with Cobweb.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Components/Grouping/Group",
	"cobweb/Bits/X3DConstants",
	"cobweb/InputOutput/Loader",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode,
          X3DUrlObject,
          X3DBoundedObject,
          Group,
          X3DConstants,
          Loader)
{
"use strict";

	function Inline (executionContext)
	{
		X3DChildNode     .call (this, executionContext);
		X3DUrlObject     .call (this, executionContext);
		X3DBoundedObject .call (this, executionContext);

		this .addType (X3DConstants .Inline);
		
		this .addChildren ("buffer", new Fields .SFTime ());

		this .scene    = this .getBrowser () .getDefaultScene ();
		this .group    = new Group (executionContext);
		this .getBBox  = this .group .getBBox  .bind (this .group);
		this .traverse = this .group .traverse .bind (this .group);
	}

	Inline .prototype = $.extend (Object .create (X3DChildNode .prototype),
		X3DUrlObject .prototype,
		X3DBoundedObject .prototype,
	{
		constructor: Inline,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "load",       new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "url",        new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new Fields .SFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "Inline";
		},
		getComponentName: function ()
		{
			return "Networking";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DChildNode     .prototype .initialize .call (this);
			X3DUrlObject     .prototype .initialize .call (this);
			X3DBoundedObject .prototype .initialize .call (this);

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .group .setup ();
			this .group .isCameraObject_ .addFieldInterest (this .isCameraObject_);

			this .load_   .addInterest (this, "set_load__");
			this .url_    .addInterest (this, "set_url__");
			this .buffer_ .addInterest (this, "set_buffer__");

			this .requestAsyncLoad ();
		},
		set_live__: function ()
		{
			if (this .checkLoadState () == X3DConstants .COMPLETE_STATE)
			{
				var live = this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ();

				if (live)
					this .scene .beginUpdate ();
				else
					this .scene .endUpdate ();
			}
		},
		set_load__: function ()
		{
			if (this .load_ .getValue ())
				this .buffer_ .addEvent ();

			else
				this .requestUnload ();
		},
		set_url__: function ()
		{
			this .buffer_ .addEvent ();
		},
		set_buffer__: function ()
		{
			if (! this .load_ .getValue ())
				return;

			this .setLoadState (X3DConstants .NOT_STARTED_STATE);

			this .requestAsyncLoad ();
		},
		requestImmediateLoad: function ()
		{
			try
			{
				this .setInternalScene (new Loader (this) .createX3DFromURL (this .url_));
			}
			catch (error)
			{
				console .log (error);
				this .setInternalScene (this .getBrowser () .getDefaultScene ());
			}
		},
		requestAsyncLoad: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);

			new Loader (this) .createX3DFromURL (this .url_, this .setInternalSceneAsync .bind (this));
		},
		requestUnload: function ()
		{
			if (this .checkLoadState () === X3DConstants .NOT_STARTED_STATE || this .checkLoadState () === X3DConstants .FAILED_STATE)
				return;

			this .setLoadState (X3DConstants .NOT_STARTED_STATE);
			this .setInternalScene (this .getBrowser () .getDefaultScene ());
		},
		setInternalSceneAsync: function (scene)
		{
			if (scene)
			{
				this .setLoadState (X3DConstants .COMPLETE_STATE);
				this .setInternalScene (scene);
			}
			else
			{
				this .setLoadState (X3DConstants .FAILED_STATE);
				this .setInternalScene (this .getBrowser () .getDefaultScene ());
			}
		},
		setInternalScene: function (scene)
		{
			this .scene .endUpdate ();
			this .scene .rootNodes .removeInterest (this .group .children_, "setValue");

			// Set new scene.

			this .scene = scene;
			this .scene .setup ();

			//this .scene .setExecutionContext (this .getExecutionContext ());
			this .scene .rootNodes .addInterest (this .group .children_, "setValue");
			this .group .children_ = this .scene .rootNodes;

			this .set_live__ ();

			this .getBrowser () .addBrowserEvent ();
		},
		getInternalScene: function ()
		{
			return this .scene;
		},
	});

	return Inline;
});


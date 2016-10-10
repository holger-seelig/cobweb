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
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DBaseNode,
          X3DConstants)
{
"use strict";

	function ImportedNode (executionContext, inlineNode, exportedName, importedName)
	{
		X3DBaseNode .call (this, executionContext);

		this .inlineNode   = inlineNode;
		this .exportedName = exportedName;
		this .importedName = importedName;
		this .routes       = { };

		this .inlineNode .loadState_ .addInterest (this, "set_loadState__");
	}

	ImportedNode .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: ImportedNode,
		getTypeName: function ()
		{
			return "ImportedNode";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "importedNodes";
		},
		getInlineNode: function ()
		{
			return this .inlineNode;
		},
		getExportedName: function ()
		{
			return this .exportedName;
		},
		getExportedNode: function ()
		{
			return this .inlineNode .getInternalScene () .getExportedNode (this .exportedName);
		},
		getImportedName: function ()
		{
			return this .importedName;
		},
		addRoute: function (sourceNode, sourceField, destinationNode, destinationField)
		{
			// Add route.

			var id = sourceNode .getId () + "." + sourceField + " " + destinationNode .getId () + "." + destinationField;

			this .routes [id] =
			{
				sourceNode:       sourceNode,
				sourceField:      sourceField,
				destinationNode:  destinationNode,
				destinationField: destinationField,
			};

			// Try to resolve source or destination node.

			if (this .inlineNode .checkLoadState () === X3DConstants .COMPLETE_STATE)
				return this .resolveRoute (id);
		},
		resolveRoute: function (id)
		{
			try
			{
				var
					route            = this .routes [id],
					sourceNode       = route .sourceNode,
					sourceField      = route .sourceField,
					destinationNode  = route .destinationNode,
					destinationField = route .destinationField;

				if (route ._route)
					route ._route .dispose ();

				if (sourceNode instanceof ImportedNode)
					sourceNode = sourceNode .getExportedNode () .getValue ();

				if (destinationNode instanceof ImportedNode)
					destinationNode = destinationNode .getExportedNode () .getValue ();

				return route ._route = this .getExecutionContext () .addRoute (new Fields .SFNode (sourceNode), sourceField, new Fields .SFNode (destinationNode), destinationField);
			}
			catch (error)
			{
				console .error (error .message);
			}
		},
		deleteRoutes: function ()
		{
			var routes = this .routes;

			for (var id in routes)
			{
				var route = routes [id];

				if (route ._route)
				{
					this .getExecutionContext () .deleteRoute (route ._route);
					delete route ._route;
				}
			}
		},
		set_loadState__: function ()
		{
			switch (this .inlineNode .checkLoadState ())
			{
				case X3DConstants .NOT_STARTED_STATE:
				case X3DConstants .FAILED_STATE:
				{
					this .deleteRoutes ();
					break;
				}
				case X3DConstants .COMPLETE_STATE:
				{
					this .deleteRoutes ();

					try
					{
						var routes = this .routes;

						for (var id in routes)
							this .resolveRoute (id);
					}
					catch (error)
					{
						console .error (error);
					}

					break;
				}
			}
		},
		dispose: function ()
		{
			this .inlineNode .loadState_ .removeInterest (this, "set_loadState__");

			this .deleteRoutes ();

			X3DBaseNode .prototype .dispose .call (this);
		},
	});

	return ImportedNode;
});

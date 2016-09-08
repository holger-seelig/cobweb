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


define ("cobweb/Components/Followers/OrientationChaser",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DChaserNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Rotation4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChaserNode, 
          X3DConstants,
          Rotation4)
{
"use strict";

	var
		a        = new Rotation4 (0, 0, 1, 0),
		rotation = new Rotation4 (0, 0, 1, 0);

	function OrientationChaser (executionContext)
	{
		X3DChaserNode .call (this, executionContext);

		this .addType (X3DConstants .OrientationChaser);
	}

	OrientationChaser .prototype = $.extend (Object .create (X3DChaserNode .prototype),
	{
		constructor: OrientationChaser,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "duration",           new Fields .SFTime (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new Fields .SFRotation ()),
		]),
		getTypeName: function ()
		{
			return "OrientationChaser";
		},
		getComponentName: function ()
		{
			return "Followers";
		},
		getContainerField: function ()
		{
			return "children";
		},
		getVector: function ()
		{
			return new Rotation4 (0, 0, 1, 0);
		},
		equals: function (lhs, rhs, tolerance)
		{
			a .assign (lhs) .inverse () .multRight (rhs);

			return Math .abs (a .angle) < tolerance;
		},
		interpolate: function (source, destination, weight)
		{
			return rotation .assign (source) .slerp (destination, weight);
		},
		step: function (value1, value2, t)
		{
			this .deltaOut .assign (value2) .inverse () .multRight (value1) .multLeft (this .output);

			this .output .slerp (this .deltaOut, t);
		},
	});

	return OrientationChaser;
});



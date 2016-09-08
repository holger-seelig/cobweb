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


define ("cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
[
	"jquery",
	"cobweb/Fields",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DSensorNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	function X3DEnvironmentalSensorNode (executionContext)
	{
		X3DSensorNode .call (this, executionContext);

		this .addType (X3DConstants .X3DEnvironmentalSensorNode);

		this .addChildren ("traversed", new Fields .SFBool (true));

		this .currentTraversed = true;
	}

	X3DEnvironmentalSensorNode .prototype = $.extend (Object .create (X3DSensorNode .prototype),
	{
		constructor: X3DEnvironmentalSensorNode,
		initialize: function ()
		{
			X3DSensorNode .prototype .initialize .call (this);

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .enabled_   .addInterest (this, "set_live__");
			this .size_      .addInterest (this, "set_live__");
			this .traversed_ .addInterest (this, "set_live__");

			this .set_live__ ();
		},
		setTraversed: function (value)
		{
		   if (value)
			{
				if (this .traversed_ .getValue () === false)
					this .traversed_ = true;
			}
			else
			{
				if (this .currentTraversed !== this .traversed_ .getValue ())
					this .traversed_ = this .currentTraversed;
			}

		   this .currentTraversed = value;
		},
		getTraversed: function ()
		{
		   return this .currentTraversed;
		},
		set_live__: function ()
		{
			if (this .traversed_ .getValue () && this .enabled_ .getValue () && this .isLive () .getValue () && this .getExecutionContext () .isLive () .getValue () && ! this .size_. getValue () .equals (Vector3 .Zero))
			{
				this .getBrowser () .sensors () .addInterest (this, "update");
			}
			else
			{
				this .getBrowser () .sensors () .removeInterest (this, "update");
				
				if (this .isActive_ .getValue ())
				{
					this .isActive_ = false;
					this .exitTime_ = this .getBrowser () .getCurrentTime ();
				}
			}
		},
		update: function () { },
	});

	return X3DEnvironmentalSensorNode;
});



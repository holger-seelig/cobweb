
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DColorNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Color3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DColorNode, 
          X3DConstants,
          Color3)
{
"use strict";

	var white = new Color3 (1, 1, 1);

	function Color (executionContext)
	{
		X3DColorNode .call (this, executionContext);

		this .addType (X3DConstants .Color);

		this .color = this .color_ .getValue ();
	}

	Color .prototype = $.extend (Object .create (X3DColorNode .prototype),
	{
		constructor: Color,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "color",    new Fields .MFColor ()),
		]),
		getTypeName: function ()
		{
			return "Color";
		},
		getComponentName: function ()
		{
			return "Rendering";
		},
		getContainerField: function ()
		{
			return "color";
		},
		isTransparent: function ()
		{
			return false;
		},
		getWhite: function ()
		{
			return white;
		},
	});

	return Color;
});




define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Followers/X3DDamperNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DDamperNode, 
          X3DConstants)
{
	with (Fields)
	{
		function TexCoordDamper2D (executionContext)
		{
			X3DDamperNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TexCoordDamper2D);
		}

		TexCoordDamper2D .prototype = $.extend (new X3DDamperNode (),
		{
			constructor: TexCoordDamper2D,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_value",          new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_destination",    new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialValue",       new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "initialDestination", new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "order",              new SFInt32 (3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tau",                new SFTime (0.3)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tolerance",          new SFFloat (-1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "value_changed",      new MFVec2f ()),
			]),
			getTypeName: function ()
			{
				return "TexCoordDamper2D";
			},
			getComponentName: function ()
			{
				return "Followers";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return TexCoordDamper2D;
	}
});


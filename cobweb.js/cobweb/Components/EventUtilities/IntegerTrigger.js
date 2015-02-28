
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EventUtilities/X3DTriggerNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTriggerNode, 
          X3DConstants)
{
	with (Fields)
	{
		function IntegerTrigger (executionContext)
		{
			X3DTriggerNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .IntegerTrigger);
		}

		IntegerTrigger .prototype = $.extend (new X3DTriggerNode (),
		{
			constructor: IntegerTrigger,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_boolean",  new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "integerKey",   new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "triggerValue", new SFInt32 ()),
			]),
			getTypeName: function ()
			{
				return "IntegerTrigger";
			},
			getComponentName: function ()
			{
				return "EventUtilities";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return IntegerTrigger;
	}
});


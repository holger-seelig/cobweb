
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
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode,
          X3DUrlObject,
          X3DBoundedObject,
          Group,
          X3DConstants)
{
	with (Fields)
	{
		function Inline (executionContext)
		{
			X3DChildNode     .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject     .call (this, executionContext .getBrowser (), executionContext);
			X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Inline);

			this .scene    = this .getBrowser () .getDefaultScene ();
			this .group    = new Group (executionContext);
			this .traverse = this .group .traverse .bind (this .group);
		}

		Inline .prototype = $.extend (new X3DChildNode (),
			X3DUrlObject .prototype,
			X3DBoundedObject .prototype,
		{
			constructor: Inline,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "load",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",        new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new SFVec3f ()),
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

				this .group .setup ();

				this .requestImmediateLoad ();
			},
			requestImmediateLoad: function ()
			{
				try
				{
					setTimeout (this .setScene .bind (this, this .getBrowser () .createX3DFromURL (this .url_)), 0);
				}
				catch (error)
				{
					console .log (error);
					this .setScene (this .getBrowser () .getDefaultScene ());
				}
			},
			setScene: function (scene)
			{
				this .scene .removeInterest (this .group .children_, "setValue");

				// Set new scene.

				this .scene = scene;
				this .scene .setup ();
				
				this .scene .addInterest (this .group .children_, "setValue");
				this .group .children_ = this .scene .rootNodes;

				this .getBrowser () .addBrowserEvent ();
			},
			getScene: function ()
			{
				return this .scene;
			},
		});

		return Inline;
	}
});

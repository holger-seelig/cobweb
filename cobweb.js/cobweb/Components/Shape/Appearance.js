
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Shape/X3DAppearanceNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DAppearanceNode,
          X3DCast,
          X3DConstants)
{
	with (Fields)
	{
		function Appearance (executionContext)
		{
			X3DAppearanceNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Appearance);
		}

		Appearance .prototype = $.extend (new X3DAppearanceNode (),
		{
			constructor: Appearance,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "fillProperties",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "lineProperties",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "material",         new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "texture",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "textureTransform", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "shaders",          new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "Appearance";
			},
			getComponentName: function ()
			{
				return "Shape";
			},
			getContainerField: function ()
			{
				return "appearance";
			},
			initialize: function ()
			{
				X3DAppearanceNode .prototype .initialize .call (this);
				
				this .material_ .addInterest (this, "set_material__");
				this .texture_  .addInterest (this, "set_texture__");
				
				this .set_material__ ();
				this .set_texture__ ();
				this .set_textureTransform__ ();
			},
			isTransparent: function ()
			{
				return (this .materialNode && this .materialNode .isTransparent ()) ||
				       (this .textureNode && this .textureNode .isTransparent ());
			},
			set_material__: function ()
			{
				this .materialNode = X3DCast (X3DConstants .X3DMaterialNode, this .material_);
			},
			set_texture__: function ()
			{
				this .textureNode = X3DCast (X3DConstants .X3DTextureNode, this .texture_);
			},
			set_textureTransform__: function ()
			{
				this .textureTransformNode = X3DCast (X3DConstants .X3DTextureTransformNode, this .textureTransform_);
				
				if (this .textureTransformNode)
					return;
				
				this .textureTransformNode = this .getBrowser () .getDefaultTextureTransform ();
			},
			traverse: function ()
			{
				var browser = this .getBrowser ();

				browser .setMaterial (this .materialNode);
				browser .setTexture (this .textureNode);

				this .textureTransformNode .traverse ();
			},
		});

		return Appearance;
	}
});


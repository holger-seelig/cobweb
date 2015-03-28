
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Complex,
          Vector2,
          Vector3)
{
	with (Fields)
	{
		function Cylinder (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Cylinder);
		}

		Cylinder .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Cylinder,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "top",      new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bottom",   new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "side",     new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "height",   new SFFloat (2)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",   new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new SFBool (true)),
			]),
			getTypeName: function ()
			{
				return "Cylinder";
			},
			getComponentName: function ()
			{
				return "Geometry3D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
			build: function ()
			{
				var
					options    = this .getBrowser () .getCylinderOptions (),
					vDimension = options .vDimension_ .getValue ();

				this .getTexCoords () .push ([ ]);

				var
					radius = this .radius_ .getValue (),
					y1     = this .height_ .getValue () / 2,
					y2     = -y1;

				if (this .side_ .getValue ())
				{
					for (var i = 0; i < vDimension; ++ i)
					{
						var
							u1     = i / vDimension,
							theta1 = 2 * Math .PI * u1,
							n1     = Complex .Polar (-1, theta1),
							p1     = Complex .multiply (n1, radius);

						var
							u2     = (i + 1) / vDimension,
							theta2 = 2 * Math .PI * u2,
							n2     = Complex .Polar (-1, theta2),
							p2     = Complex .multiply (n2, radius);

						// p1 - p4
						//  | \ |
						// p2 - p3

						// p1
						this .getTexCoords () [0] .push (u1, 1, 0, 1);
						this .addNormal (new Vector3 (n1 .imag,  0, n1 .real));
						this .addVertex (new Vector3 (p1 .imag, y1, p1 .real));

						// p2
						this .getTexCoords () [0] .push (u1, 0, 0, 1);
						this .addNormal (new Vector3 (n1 .imag,  0, n1 .real));
						this .addVertex (new Vector3 (p1 .imag, y2, p1 .real));

						// p3
						this .getTexCoords () [0] .push (u2, 0, 0, 1);
						this .addNormal (new Vector3 (n2 .imag,  0, n2 .real));
						this .addVertex (new Vector3 (p2 .imag, y2, p2 .real));

						//

						// p1
						this .getTexCoords () [0] .push (u1, 1, 0, 1);
						this .addNormal (new Vector3 (n1 .imag,  0, n1 .real));
						this .addVertex (new Vector3 (p1 .imag, y1, p1 .real));

						// p3
						this .getTexCoords () [0] .push (u2, 0, 0, 1);
						this .addNormal (new Vector3 (n2 .imag,  0, n2 .real));
						this .addVertex (new Vector3 (p2 .imag, y2, p2 .real));

						// p4
						this .getTexCoords () [0] .push (u2, 1, 0, 1);
						this .addNormal (new Vector3 (n2 .imag,  0, n2 .real));
						this .addVertex (new Vector3 (p2 .imag, y1, p2 .real));
					}
				}

				if (this .top_ .getValue ())
				{
					var
						texCoord = [ ],
						points   = [ ];

					for (var i = 0; i < vDimension; ++ i)
					{
						var
							u     = i / vDimension,
							theta = 2 * Math .PI * u,
							t     = Complex .Polar (-1, theta);

						texCoord .push (new Vector2 ((t .imag + 1) / 2, -(t .real - 1) / 2));
						points   .push (new Vector3 (t .imag * radius, y1, t .real * radius));
					}

					var
						n  = new Vector3 (0, 1, 0),
						t0 = texCoord [0],
						p0 = points [0];

					for (var i = 1, length = points .length - 1; i < length; ++ i)
					{
						var
							t1 = texCoord [i],
							t2 = texCoord [i + 1];

						this .getTexCoords () [0] .push (t0 .x, t0 .y, 0, 1);
						this .addNormal (n);
						this .addVertex (p0);

						this .getTexCoords () [0] .push (t1 .x, t1 .y, 0, 1);
						this .addNormal (n);
						this .addVertex (points [i]);

						this .getTexCoords () [0] .push (t2 .x, t2 .y, 0, 1);
						this .addNormal (n);
						this .addVertex (points [i + 1]);
					}
				}

				if (this .bottom_ .getValue ())
				{
					var
						texCoord = [ ],
						points   = [ ];

					for (var i = vDimension - 1; i > -1; -- i)
					{
						var
							u     = i / vDimension,
							theta = 2 * Math .PI * u,
							t     = Complex .Polar (-1, theta);

						texCoord .push (new Vector2 ((t .imag + 1) / 2, (t .real + 1) / 2));
						points   .push (new Vector3 (t .imag * radius, y2, t .real * radius));
					}
				
					var
						n  = new Vector3 (0, -1, 0),
						t0 = texCoord [0],
						p0 = points [0];
					
					for (var i = 1, length = points .length - 1; i < length; ++ i)
					{
						var
							t1 = texCoord [i],
							t2 = texCoord [i + 1];

						this .getTexCoords () [0] .push (t0 .x, t0 .y, 0, 1);
						this .addNormal (n);
						this .addVertex (p0);

						this .getTexCoords () [0] .push (t1 .x, t1 .y, 0, 1);
						this .addNormal (n);
						this .addVertex (points [i]);

						this .getTexCoords () [0] .push (t2 .x, t2 .y, 0, 1);
						this .addNormal (n);
						this .addVertex (points [i + 1]);
					}
				}

				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);
			},
		});

		return Cylinder;
	}
});


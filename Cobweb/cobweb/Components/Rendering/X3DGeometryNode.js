
define ([
	"jquery",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Box3",
	"standard/Math/Numbers/Vector3",
],
function ($, X3DNode, X3DConstants, Box3, Vector3)
{
	function X3DGeometryNode (browser, executionContext)
	{
		X3DNode .call (this, browser, executionContext);

		this .bbox     = new Box3 ();
		this .solid    = true;
		this .ccw      = true;
		this .normals  = [ ];
		this .vertices = [ ];

		this .addType (X3DConstants .X3DGeometryNode);
	}

	X3DGeometryNode .prototype = $.extend (new X3DNode (),
	{
		constructor: X3DGeometryNode,
		setup: function ()
		{
			X3DNode .prototype .setup .call (this);

			this .update ();
		},
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);

			var gl = this .getBrowser () .getContext ();

			this .normalBuffer = gl .createBuffer ();
			this .vertexBuffer = gl .createBuffer ();
		},
		getBBox: function ()
		{
			return this .bbox;
		},
		setSolid: function (value)
		{
			this .solid = value;
		},
		setCCW: function (value)
		{
			this .ccw = value;
		},
		addNormal: function (normal)
		{
			this .normals .push (normal .x);
			this .normals .push (normal .y);
			this .normals .push (normal .z);
		},
		addVertex: function (vertex)
		{
			this .min = this .min .min (vertex);
			this .max = this .max .max (vertex);

			this .vertices .push (vertex .x);
			this .vertices .push (vertex .y);
			this .vertices .push (vertex .z);
			this .vertices .push (1);
		},
		update: function ()
		{
			this .clear ();
			this .build ();

			this .bbox = this .vertices .length ? new Box3 (this .min, this .max, true) : new Box3 ();

			this .transfer ();
		},
		clear: function ()
		{
			this .min = new Vector3 (Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
			this .max = new Vector3 (Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
		
			this .normals  .length = 0;
			this .vertices .length = 0;
		},
		transfer: function ()
		{
			var gl = this .getBrowser () .getContext ();

			gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .normals), gl .STATIC_DRAW);

			gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
			gl .bufferData (gl .ARRAY_BUFFER, new Float32Array (this .vertices), gl .STATIC_DRAW);
			this .vertices .count = this .vertices .length / 4;
  		},
		traverse: function (context)
		{
			var gl = this .getBrowser () .getContext ();
		
			if (this .solid)
				gl .enable (gl .CULL_FACE);
			else
				gl .disable (gl .CULL_FACE);
	
			gl .frontFace (context .modelViewMatrix .determinant3 () > 0 ? (this .ccw ? gl .CCW : gl .CW) : (this .ccw ? gl .CW : gl .CCW));

			// Shader

			var shader = this .getBrowser () .getDefaultShader ();

			shader .use (context);

			var normal   = shader .normal;
			var position = shader .position;

			//

			var vertexAttribArray = 0;

			if (normal >= 0)
			{
				gl .enableVertexAttribArray (vertexAttribArray ++);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .normalBuffer);
				gl .vertexAttribPointer (normal, 3, gl .FLOAT, false, 0, 0);
			}

			if (position >= 0)
			{
				gl .enableVertexAttribArray (vertexAttribArray ++);
				gl .bindBuffer (gl .ARRAY_BUFFER, this .vertexBuffer);
				gl .vertexAttribPointer (position, 4, gl .FLOAT, false, 0, 0);
			}

			if (vertexAttribArray)
				gl .drawArrays (gl .TRIANGLES, 0, this .vertices .count);
		},
	});

	return X3DGeometryNode;
});

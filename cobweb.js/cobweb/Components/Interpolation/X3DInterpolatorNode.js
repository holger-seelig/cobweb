
define ([
	"jquery",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DChildNode, 
          X3DConstants)
{
	function X3DInterpolatorNode (browser, executionContext)
	{
		X3DChildNode .call (this, browser, executionContext);

		this .addType (X3DConstants .X3DInterpolatorNode);
	}

	X3DInterpolatorNode .prototype = $.extend (new X3DChildNode (),
	{
		constructor: X3DInterpolatorNode,
	});

	return X3DInterpolatorNode;
});


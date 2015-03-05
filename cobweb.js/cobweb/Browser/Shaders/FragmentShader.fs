// -*- Mode: C++; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
precision mediump float;

uniform bool x3d_lighting;      // true if a X3DMaterialNode is attached, otherwise false
uniform bool x3d_colorMaterial; // true if a X3DColorNode is attached, otherwise false

uniform float x3d_ambientIntensity;
uniform vec3  x3d_diffuseColor;
uniform vec3  x3d_specularColor;
uniform vec3  x3d_emissiveColor;
uniform float x3d_shininess;
uniform float x3d_transparency;

uniform bool      x3d_texturing;      // true if a X3DTexture2DNode is attached, otherwise false
uniform sampler2D x3d_texture;
uniform int       x3d_textureComponents;

varying vec4 C; // color
varying vec4 t; // texCoord
varying vec3 N; // normalized normal vector at this point on geometry
varying vec3 v; // point on geometry


void
main ()
{
	vec4 finalColor = vec4 (0.0, 0.0, 0.0, 0.0);

	if (x3d_lighting)
	{
		vec3 L = normalize (-v);    // normalized vector from point on geometry to light source i position
		vec3 V = normalize (-v);    // normalized vector from point on geometry to viewer's position
		vec3 H = normalize (L + V); // specular term
	
		vec3  diffuseFactor = vec3 (1.0, 1.0, 1.0);
		float alpha         = 1.0 - x3d_transparency;

		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				vec4 T = texture2D (x3d_texture, vec2 (t .s, t .t));

				diffuseFactor  = x3d_textureComponents < 3 ? T .rgb * C .rgb : T .rgb;
				alpha         *= T .a;
			}
			else
				diffuseFactor = C .rgb;

			alpha *= C .a;
		}
		else
		{
			if (x3d_texturing)
			{
				vec4 T = texture2D (x3d_texture, vec2 (t .s, t .t));

				diffuseFactor  = x3d_textureComponents < 3 ? T .rgb * x3d_diffuseColor : T .rgb;
				alpha         *= T .a;
			}
			else
				diffuseFactor = x3d_diffuseColor;
		}

		vec3 ambientTerm   = diffuseFactor * x3d_ambientIntensity;
		vec3 diffuseTerm   = diffuseFactor * max (dot (N, L), 0.0);
		vec3 specularTerm  = x3d_specularColor * pow (max (dot (N, H), 0.0), 128.0 * x3d_shininess);
		vec3 emissiveTerm  = x3d_emissiveColor;

		finalColor += vec4 (ambientTerm + diffuseTerm + specularTerm + emissiveTerm, alpha);
	}
	else
	{
		if (x3d_colorMaterial)
		{
			if (x3d_texturing)
			{
				vec4 T = texture2D (x3d_texture, vec2 (t .s, t .t));

				if (x3d_textureComponents < 3)
				{
					finalColor .rgb = T .rgb * C .rgb;
					finalColor .a   = T .a;
				}
				else
					finalColor = T;

				finalColor .a *= C .a;
			}
			else
				finalColor = C;
		}
		else
		{
			if (x3d_texturing)
				finalColor = texture2D (x3d_texture, vec2 (t .s, t .t));
			else
				finalColor = vec4 (1.0, 1.0, 1.0, 1.0);
		}
	}

	gl_FragColor = finalColor;
}

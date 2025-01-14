#include <common>

#if THREE_REVISION < 143

	#define luminance(v) linearToRelativeLuminance(v)

#endif

#ifdef FRAMEBUFFER_PRECISION_HIGH

	uniform mediump sampler2D inputBuffer;

#else

	uniform lowp sampler2D inputBuffer;

#endif

#ifdef RANGE

	uniform vec2 range;

#elif defined(THRESHOLD)

	uniform float threshold;
	uniform float smoothing;

#endif

varying vec2 vUv;

void main() {

	vec4 texel = texture2D(inputBuffer, vUv);
	float l = luminance(texel.rgb);

	#ifdef RANGE

		// Apply a luminance range mask.
		float low = step(range.x, l);
		float high = step(l, range.y);

		l *= low * high;

	#elif defined(THRESHOLD)

		l = smoothstep(threshold, threshold + smoothing, l);

	#endif

	#ifdef COLOR

		gl_FragColor = vec4(texel.rgb * l, l);

	#else

		gl_FragColor = vec4(l);

	#endif

}

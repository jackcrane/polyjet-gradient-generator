
float random(vec3 scale, float seed) {
	/* use the fragment position for a different seed per-pixel */
	return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // Generate a random float based on the fragment coordinates
    float noise = rand(gl_FragCoord.xy);

    // Use the noise value for some purpose, e.g., adding a noise effect to a texture
    // Output the result
    gl_FragColor = vec4(noise, noise, noise, 1.0);
}
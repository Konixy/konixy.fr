<script lang="ts">
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { sineInOut } from 'svelte/easing';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uFadeIn;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha * uFadeIn, auroraAlpha * uFadeIn);
}
`;

interface Props {
	colorStops?: string[];
	amplitude?: number;
	blend?: number;
	time?: number;
	speed?: number;
}

const scrollStep = 500;

let {
	colorStops = ['#0d41e1', '#07c8f9', '#0d41e1'],
	amplitude = 1.0,
	blend = 1.0,
	time,
	speed
}: Props = $props();

let ctnDom: HTMLDivElement;
let animatedAmplitude = $state(0);
let scrollState = $state(
	Math.min(typeof window !== 'undefined' ? window.scrollY : 0, scrollStep) / scrollStep
);

$effect(() => {
	const ctn = ctnDom;
	if (!ctn) return;
	gsap.registerPlugin(ScrollTrigger);

	const renderer = new Renderer({
		alpha: true,
		premultipliedAlpha: true,
		antialias: true
	});
	const gl = renderer.gl;
	gl.clearColor(0, 0, 0, 0);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.canvas.style.backgroundColor = 'transparent';

	let program: Program | undefined;

	function resize() {
		if (!ctn) return;
		const width = ctn.offsetWidth;
		const height = ctn.offsetHeight;
		renderer.setSize(width, height);
		const responsiveWidth = width > 768 ? width : width * 2;
		if (program) {
			program.uniforms.uResolution.value = [responsiveWidth, height];
		}
	}
	window.addEventListener('resize', resize);

	// GSAP ScrollTrigger for smooth scroll animation
	// Create an object to animate for the scrub effect
	const scrollProxy = { value: 0 };
	const scrollTween = gsap.to(scrollProxy, {
		value: 1,
		ease: 'none',
		onUpdate: () => {
			scrollState = scrollProxy.value;
		}
	});

	const scrollTrigger = ScrollTrigger.create({
		trigger: document.body,
		start: 'top top',
		end: `+=${scrollStep}`,
		scrub: 1.5,
		animation: scrollTween
	});

	const geometry = new Triangle(gl);
	if (geometry.attributes.uv) {
		delete geometry.attributes.uv;
	}

	const colorStopsArray = colorStops.map((hex) => {
		const c = new Color(hex);
		return [c.r, c.g, c.b];
	});

	program = new Program(gl, {
		vertex: VERT,
		fragment: FRAG,
		uniforms: {
			uTime: { value: 0 },
			uAmplitude: { value: 0 },
			uColorStops: { value: colorStopsArray },
			uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
			uBlend: { value: blend },
			uFadeIn: { value: 0 }
		}
	});

	const mesh = new Mesh(gl, { geometry, program });
	ctn.appendChild(gl.canvas);

	let animateId = 0;
	const startTime = Date.now();
	const fadeDuration = 5000; // 3.5 seconds for a slower, more elegant animation

	const update = (t: number) => {
		animateId = requestAnimationFrame(update);
		const currentTime = time ?? t * 0.01;
		const currentSpeed = speed ?? 1.0;

		// Calculate amplitude animation progress
		const elapsed = Date.now() - startTime;
		const progress = Math.min(elapsed / fadeDuration, 1);
		let easedProgress = Math.min(sineInOut(progress), Math.max(1 - scrollState, 0.4));
		animatedAmplitude = amplitude * easedProgress;

		if (program) {
			program.uniforms.uTime.value = currentTime * currentSpeed * 0.1;
			program.uniforms.uAmplitude.value = animatedAmplitude;
			program.uniforms.uBlend.value = blend;
			program.uniforms.uFadeIn.value = easedProgress;
			program.uniforms.uColorStops.value = colorStops.map((hex: string) => {
				const c = new Color(hex);
				return [c.r, c.g, c.b];
			});
			renderer.render({ scene: mesh });
		}
	};
	animateId = requestAnimationFrame(update);

	resize();

	return () => {
		cancelAnimationFrame(animateId);
		window.removeEventListener('resize', resize);
		scrollTrigger.kill();
		if (ctn && gl.canvas.parentNode === ctn) {
			ctn.removeChild(gl.canvas);
		}
		gl.getExtension('WEBGL_lose_context')?.loseContext();
	};
});
</script>

<div bind:this={ctnDom} class="aurora fixed inset-0 -z-10 h-full w-full"></div>

<style>
.aurora::before {
	content: '';
	background-color: transparent;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
	background-repeat: repeat;
	background-size: 182px;
	opacity: 0.15;
	top: 0;
	left: 0;
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>

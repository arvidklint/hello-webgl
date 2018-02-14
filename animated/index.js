// HELLO WEBGL

// GET WEBGL CONTEXT
const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')

// CLEAR BACKGROUND
gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

// SHADER SOURCES
const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aUVs;

  uniform float uTime;

  varying highp vec2 vUVs;
  varying highp float vTime;

  void main() {
    gl_Position = aVertexPosition;
    vUVs = aUVs;
    vTime = uTime;
  }
`

const fragmentShaderSource = `
  varying highp vec2 vUVs;
  varying highp float vTime;

  precision highp float;

  // FUNCTION FROM https://www.shadertoy.com/view/MsS3Wc
  highp vec3 hsb2rgb( in vec3 c ) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
  }

  void main() {
    float pi = 3.1415;
    highp vec2 middle = vec2(0.5, 0.5);
    highp vec2 uv = (vUVs - middle) * 2.0;

    float angle = atan(uv.y, uv.x);
    float diff = sin(angle * 2.0 + vTime * 0.75) * 0.01 + cos(angle * 3.0 + vTime * 0.7) * 0.005;
    float dist = distance(vUVs, middle);
    float circle1 = smoothstep(0.22 + diff, 0.2 + diff, dist);
    float circle2 = smoothstep(0.2 + diff, 0.18 + diff, dist);
    float multiplier = (circle1 - circle2);

    // float waveColor = max(min(wave1 - vUVs.y, vUVs.y - wave2), min(vUVs.y - wave1, wave2 - vUVs.y));
    float normalizedAngle = angle / (2.0 * pi);
    highp vec3 color = hsb2rgb(vec3(normalizedAngle + vTime * 0.1, 1.0, 1.0)) * multiplier;

    gl_FragColor = vec4(color, 1.0);
  }
`

// CREATE AND COMPILE VERTEX SHADER
const vertexShader = gl.createShader(gl.VERTEX_SHADER)

gl.shaderSource(vertexShader, vertexShaderSource)

gl.compileShader(vertexShader)

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  alert('An error occurred compiling the vertex shader: ' + gl.getShaderInfoLog(vertexShader))
  gl.deleteShader(vertexShader)
}

// CREATE AND COMPILE FRAGMENT SHADER
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

gl.shaderSource(fragmentShader, fragmentShaderSource)

gl.compileShader(fragmentShader)

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  alert('An error occurred compiling the fragment shader: ' + gl.getShaderInfoLog(fragmentShader))
  gl.deleteShader(fragmentShader)
}

// CREATE AND LINK SHADER PROGRAM
const shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram, vertexShader)
gl.attachShader(shaderProgram, fragmentShader)
gl.linkProgram(shaderProgram)

// CREATE AND SET VERTEX POSITION BUFFERS
const vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

const vertices = [
  // FIRST TRIANGLE
  -1.0,  1.0, 0.0, // top left
   1.0,  1.0, 0.0, // top right
  -1.0, -1.0, 0.0, // bottom left
  // SECOND TRIANGLE
  -1.0, -1.0, 0.0, // bottom left
  1.0,  1.0, 0.0, // top right
  1.0, -1.0, 0.0, // bottom right
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

// SET VERTEX ATTRIBUTES
const vertexAttributeLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
gl.enableVertexAttribArray(vertexAttributeLocation)
gl.vertexAttribPointer(
  vertexAttributeLocation,
  3,
  gl.FLOAT,
  false,
  0,
  0,
)

// UV BUFFER
const uvBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)

const uvs = [
  // FIRST TRIANGLE
  0.0, 1.0,
  1.0, 1.0,
  0.0, 0.0,
  // SECOND TRIANGLE
  0.0, 0.0,
  1.0, 1.0,
  1.0, 0.0,
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW)

const uvAttributeLocation = gl.getAttribLocation(shaderProgram, 'aUVs')
gl.enableVertexAttribArray(uvAttributeLocation)
gl.vertexAttribPointer(
  uvAttributeLocation,
  2,
  gl.FLOAT,
  false,
  0,
  0,
)

// TIME UNIFORM
const timeUniformLocation = gl.getUniformLocation(shaderProgram, 'uTime')

gl.useProgram(shaderProgram);

function draw(time) {
  gl.uniform1f(
    timeUniformLocation,
    time / 1000,
  )

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)

  window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)
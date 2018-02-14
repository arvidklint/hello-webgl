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
  attribute vec4 aVertexColor;

  varying highp vec4 vColor;

  void main() {
    gl_Position = aVertexPosition;
    vColor = aVertexColor;
  }
`

const fragmentShaderSource = `
  varying highp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
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
   0.0,  0.5, 0.0, // top middle
  -0.5, -0.5, 0.0, // bottom left
   0.5, -0.5, 0.0, // bottom right
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

// SET VERTEX ATTRIBUTES
const vertexAttributeLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
gl.enableVertexAttribArray(vertexAttributeLocation)
gl.vertexAttribPointer(
  vertexAttributeLocation,  // Attribute location in the vertex shader
  3,                        // Number of components per vertex (x, y, z)
  gl.FLOAT,                 // Component type (32 bit)
  false,                    // Normalize?
  0,                        // Stride, (offset in bytes between the beginning of each vertex)
  0,                        // Offset, (the offset in bytes specifying where to start)
)

// CREATE VERTEX COLOR BUFFERS
const colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

const vertexColors = [
  1.0, 0.0, 0.0, 1.0, // red
  0.0, 1.0, 0.0, 1.0, // green
  0.0, 0.0, 1.0, 1.0, // blue
]

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW)

// SET COLOR ATTRIBUTE
const colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'aVertexColor')
gl.enableVertexAttribArray(colorAttributeLocation)
gl.vertexAttribPointer(
  colorAttributeLocation,
  4,
  gl.FLOAT,
  false,
  0,
  0,
)

// // DRAW
gl.useProgram(shaderProgram);
gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)
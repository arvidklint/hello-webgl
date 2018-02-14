// HELLO WEBGL

// UTILS
function radToDeg(r) {
  return r * 180 / Math.PI
}

function degToRad(d) {
  return d * Math.PI / 180
}


const pressedKeys = {
  left: false,
  right: false,
  up: false,
  down: false,
  alt: false,
}
const setKeys = (key, value) => {
  if(key === 37) {
    pressedKeys.left = value
  } else if(key === 39) {
    pressedKeys.right = value
  } else if(key === 38) {
    pressedKeys.up = value
  } else if(key === 40) {
    pressedKeys.down = value
  } else if(key === 18) {
    pressedKeys.alt = value
  }
}
document.addEventListener('keydown', function(event) {
  setKeys(event.keyCode, true)
})
document.addEventListener('keyup', function(event) {
  setKeys(event.keyCode, false)
})

// GET WEBGL CONTEXT
const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')


// SHADER SOURCES
const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  varying highp vec4 vColor;

  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  void main() {
    gl_Position = projectionMatrix * viewMatrix * aVertexPosition;
    // gl_Position = projectionMatrix * aVertexPosition;
    // gl_Position = aVertexPosition;
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
// const vertices = [
//   0.0,  0.5, 0.0, // top middle
//  -0.5, -0.5, 0.0, // bottom left
//   0.5, -0.5, 0.0, // bottom right
// ]
const z = -100
const size = 50
const vertices = [
  // front
  -size, -size, z,
  size, -size, z,
  -size, size, z,
  -size, size, z,
  size, -size, z,
  size, size, z,
  // left
  -size, -size, z - size * 2,
  -size, -size, z,
  -size, size, z,
  -size, size, z - size * 2,
  -size, -size, z - size * 2,
  -size, size, z,
  // right
  size, size, z,
  size, -size, z,
  size, size, z - size * 2,
  size, -size, z,
  size, -size, z - size * 2,
  size, size, z - size * 2,
  // back
  size, -size, z - size * 2,
  -size, -size, z - size * 2,
  -size, size, z - size * 2,
  size, -size, z - size * 2,
  -size, size, z - size * 2,
  size, size, z - size * 2,
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
  1, 0, 0, 1, // red
  1, 0, 0, 1, // red
  1, 0, 0, 1, // red
  1, 0, 0, 1, // red
  1, 0, 0, 1, // red
  1, 0, 0, 1, // red
  0, 1, 0, 1, // green
  0, 1, 0, 1, // green
  0, 1, 0, 1, // green
  0, 1, 0, 1, // green
  0, 1, 0, 1, // green
  0, 1, 0, 1, // green
  0, 0, 1, 1, // blue
  0, 0, 1, 1, // blue
  0, 0, 1, 1, // blue
  0, 0, 1, 1, // blue
  0, 0, 1, 1, // blue
  0, 0, 1, 1, // blue
  1, 0, 1, 1, // purple
  1, 0, 1, 1, // purple
  1, 0, 1, 1, // purple
  1, 0, 1, 1, // purple
  1, 0, 1, 1, // purple
  1, 0, 1, 1, // purple
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

// Perspective
function perspective(fov, aspect, near, far) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
  const rangeInv = 1.0 / (near - far)

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ]
}

// CREATE PROJECTION MATRIX
const fov = degToRad(60)
const zNear = 1
const zFar = 1000
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
const projectionMatrix = mat4.create()
mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar)
// mat4.ortho(projectionMatrix, -100, 100, -100, 100, 0, 1000)

const projectionMatrixLocation = gl.getUniformLocation(shaderProgram, "projectionMatrix")

// CAMERA AND VIEWMATRIX
const cameraMatrix = mat4.create()
const viewMatrix = mat4.create()
const viewMatrixLocation = gl.getUniformLocation(shaderProgram, "viewMatrix")

const draw = () => {
  // CLEAR BACKGROUND
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // UPDATE CAMERA
  if(pressedKeys.left) {
    if (pressedKeys.alt) {
      mat4.translate(cameraMatrix, cameraMatrix, [5, 0, 0])
    } else {
      mat4.rotateY(cameraMatrix, cameraMatrix, 0.04)
    }
  }
  if(pressedKeys.right) {
    if (pressedKeys.alt) {
      mat4.translate(cameraMatrix, cameraMatrix, [-5, 0, 0])
    } else {
      mat4.rotateY(cameraMatrix, cameraMatrix, -0.04)
    }
  }
  if(pressedKeys.up) {
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -5])
  }
  if(pressedKeys.down) {
    mat4.translate(cameraMatrix, cameraMatrix, [0, 0, 5])
  }

  // Invert camera matrix
  mat4.invert(viewMatrix, cameraMatrix)

  gl.useProgram(shaderProgram)

  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)
  window.requestAnimationFrame(draw)
}
draw()

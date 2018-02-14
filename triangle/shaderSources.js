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
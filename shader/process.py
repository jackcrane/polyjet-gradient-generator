import numpy as np
from OpenGL.GL import *
from OpenGL.GLUT import *
from PIL import Image

def compile_shader(source, shader_type):
    shader = glCreateShader(shader_type)
    glShaderSource(shader, source)
    glCompileShader(shader)
    if glGetShaderiv(shader, GL_COMPILE_STATUS) != GL_TRUE:
        error = glGetShaderInfoLog(shader).decode('utf-8')
        raise RuntimeError("Shader compilation error:\n" + error)
    return shader

def load_shader_from_file(file_path, shader_type):
    with open(file_path, 'r') as file:
        shader_source = file.read()
    return compile_shader(shader_source, shader_type)

def setup_fullscreen_quad():
    # Coordinates for a fullscreen quad (two triangles)
    vertices = np.array([
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
         1.0,  1.0, 0.0
    ], dtype=np.float32)
    vertex_buffer = glGenBuffers(1)
    glBindBuffer(GL_ARRAY_BUFFER, vertex_buffer)
    glBufferData(GL_ARRAY_BUFFER, vertices.nbytes, vertices, GL_STATIC_DRAW)
    return vertex_buffer

# Initialize GLUT
glutInit()
glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA)
glutInitWindowSize(800, 600)
glutCreateWindow("Shader Window")

# Vertex Shader (simple pass-through)
vertex_shader_source = """
#version 330 core
layout(location = 0) in vec3 vertexPosition;
void main() {
    gl_Position = vec4(vertexPosition, 1.0);
}
"""

# Load the Fragment Shader from file
fragment_shader_path = "1.glsl"
shader_program = glCreateProgram()
glAttachShader(shader_program, compile_shader(vertex_shader_source, GL_VERTEX_SHADER))
glAttachShader(shader_program, load_shader_from_file(fragment_shader_path, GL_FRAGMENT_SHADER))
glLinkProgram(shader_program)
if glGetProgramiv(shader_program, GL_LINK_STATUS) != GL_TRUE:
    error = glGetProgramInfoLog(shader_program).decode('utf-8')
    raise RuntimeError("Shader program linking error:\n" + error)

# Setup fullscreen quad
vertex_buffer = setup_fullscreen_quad()

# Display function
def display():
    glClear(GL_COLOR_BUFFER_BIT)
    glUseProgram(shader_program)
    glBindBuffer(GL_ARRAY_BUFFER, vertex_buffer)
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, None)
    glEnableVertexAttribArray(0)
    glDrawArrays(GL_TRIANGLES, 0, 6)
    glutSwapBuffers()  # Use double buffering

    # Save frame to PNG
    pixels = glReadPixels(0, 0, 800, 600, GL_RGBA, GL_UNSIGNED_BYTE)
    image = Image.frombytes('RGBA', (800, 600), pixels)
    image = image.transpose(Image.FLIP_TOP_BOTTOM)
    image.save('output.png', 'PNG')

glutDisplayFunc(display)
glutIdleFunc(display)  # Keep updating the view
glutMainLoop()

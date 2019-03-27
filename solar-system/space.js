// global variables
let canvas = {}
const planets = {}

class Canvas {
  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 )
    this.renderer = new THREE.WebGLRenderer()

    this.camera.position.z = 5
    this.renderer.setSize( window.innerWidth, window.innerHeight )
  }
}

class Stars {
  constructor() {
    const starsGeometry = new THREE.Geometry()

    for (let i = 0; i < 3000; i += 1) {
      const star = new THREE.Vector3()

      star.x = THREE.Math.randFloatSpread( 2000 )
      star.y = THREE.Math.randFloatSpread( 2000 )
      star.z = THREE.Math.randFloatSpread( 2000 )

      starsGeometry.vertices.push(star)
    }

    const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.5 })

    this.universe = new THREE.Points(starsGeometry, starsMaterial)
  }
}


class Planet {
  constructor({ geometry, color, rotationSpeed = [], position }) {
    this.geometry = new THREE.SphereGeometry( ...geometry )
    this.material = new THREE.MeshBasicMaterial( { color } )

    this.sphere = new THREE.Mesh( this.geometry, this.material )

    this.rotationSpeed = {
      x: rotationSpeed[0],
      y: rotationSpeed[1]
    }

    if (position) {
      this.position = {
        x: position[0],
        y: position[1],
        z: position[2]
      }
    }
  }
}

window.onload = () => {
  // Initialize canvas
  canvas = new Canvas()
  document.body.appendChild(canvas.renderer.domElement)

  // Build planets
  const stars = new Stars()

  planets.sun = new Planet({
    geometry: [4, 32, 32],
    color: 0xffff00,
    rotationSpeed: [0.01, 0.01]
  })
  planets.earth = new Planet({
    geometry: [1, 32, 32],
    color: 'rgb(255, 255, 255)',
    rotationSpeed: [0.01, 0.01],
    position: [10, 0, 0]
  })
  planets.mars = new Planet({
    geometry: [0.5, 32, 32],
    color: 'rgb(122,122,523)',
    rotationSpeed: [0.01, 0.01],
    position: [25, 0, 0]
  })

  // Set scene
  canvas.scene.add(stars.universe)

  for (let i = 0; i < Object.keys(planets).length; i += 1) {
    const key = Object.keys(planets)[i]
    const planet = planets[key]

    if (planet.position) {
      planet.sphere.position.x = planet.position.x
      planet.sphere.position.y = planet.position.y
      planet.sphere.position.z = planet.position.z
    }

    canvas.scene.add(planet.sphere)
  }

  canvas.camera.position.z = 30

  animate()
}

function animate() {
  requestAnimationFrame(animate)

  for (let i = 0; i < Object.keys(planets).length; i += 1) {
    const key = Object.keys(planets)[i]
    const planet = planets[key]

    planet.sphere.rotation.x += planet.rotationSpeed.x
    planet.sphere.rotation.y += planet.rotationSpeed.y
  }

  canvas.renderer.render(canvas.scene, canvas.camera)
}

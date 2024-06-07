import { Suspense, useRef, useState, useEffect} from "react"
import {Canvas, extend ,  useFrame} from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF} from "@react-three/drei"
extend({OrbitControls, Canvas})
import CanvasLoader from '../Loader'
import TWEEN from "@tweenjs/tween.js"

const Jupiter = ({isMobile, authMode}) => {
  
  const timeout = (delay) => {
    return new Promise( res => setTimeout(res, delay) );
  }
  const rotateMesh = useRef()
  const earth = useGLTF('3d/jupiter/scene.glb') 

  useEffect(() => {
    
      // Define the start and end positions
    let startPosition = { x: 0, y: 0, z: 0, scale: 1 };
    let endPosition = { x: 0, y: 0, z: 0, scale: 1.35 };

    if (!authMode){
       startPosition = { x: 0, y: 0, z: 0, scale: 1.35 };
       endPosition = { x: 0, y: 0, z: 0, scale: 1 };
    }
    // Create the tween
    const tween = new TWEEN.Tween(startPosition)
      .to(endPosition, 2000) // 2 seconds duration
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        if (rotateMesh.current) {
          rotateMesh.current.position.set(startPosition.x, startPosition.y, startPosition.z);
          rotateMesh.current.scale.set(startPosition.scale,startPosition.scale,startPosition.scale);
        }
      })
      .start();

    // Animate the tween
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    };

    animate();
    
  }, [authMode]);

  useFrame(({ clock }) => {
    rotateMesh.current.rotation.y = (clock.getElapsedTime()*(Math.PI/45))
  })
  return (
    <mesh>
    <directionalLight position={[-0.1,0,0]} intensity={12} />
    <mesh ref={rotateMesh}>
      
      <ambientLight intensity={0.1} />
    <primitive object={earth.scene} scale={isMobile?0.011:0.011} position-y={0} rotation-y={0} />
    </mesh>
     </mesh>
  )
}

const JupiterCanvas = ({authMode}) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width:784px)')
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches)
    }
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }
  },[])
  return (
    <Canvas 
      shadows
      frameloop="always"
      // gl={{preserveDrawingBuffer: true}}
      camera={{ 
        fov:45,
        near:0.1,
        far:200,
        position:[0,0,33]
      }}>
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls 
            enableZoom={true}
            maxPolarAngle={Math.PI/2}
            minPolarAngle={Math.PI/2}
            />
          <Jupiter isMobile={isMobile} authMode={authMode} />
        </Suspense>
    </Canvas>
  )
}
 
export default JupiterCanvas
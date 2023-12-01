import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Triangle } from './func/triangle_class';


function App() {
  const [dotNum, setDotNum] = React.useState(1)
  const [triangleSize, setTriSize] = React.useState(108)
  const [startPos, setStartPos] = React.useState()
  const [working, setWorking] = React.useState(false)  
  const [clickCount, setClickCount] = React.useState(0)
  const [lastPos, setLastPos] = React.useState()
  const [maxTriSize, setMaxTriSize] = React.useState(200)
  
  const cnv = React.useRef()

  React.useEffect(() => {
    //cnv.current.addEventListener('mousemove', function(evt) {
  cnv.current.addEventListener('click', function(evt) {    
      const mousePos = getMousePos(cnv.current, evt);
      !working && setStartPos({x: mousePos.x, y: mousePos.y})
      !working && console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }, false);
  setMaxTriSize(cnv.current.width/2 - (cnv.current.width/100*3))
  /* cnv.current.addEventListener('mousemove', function(evt) {    
    const mousePos = getMousePos(cnv.current, evt);
          console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }, false); */

  }, [])


  //triangle size change hook
  React.useEffect(() => {
    const t3 = new Triangle(cnv, Number(triangleSize), true, "canvas")
    setClickCount(0)
  }, [triangleSize])

  //start point hook
  React.useEffect(() => {
    if(startPos && !working) {
      clear()
      setClickCount(0)
      triangle2(false)
      drawPoint(startPos)      
    }

  }, [startPos])

  function drawPoint(point, color="white", size=1) {
    if (point) {
      const ctx = cnv.current.getContext("2d")
      ctx.fillStyle=color
      ctx.fillRect(point.x,point.y,size,size)
    }
  }

  function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

   
  function randVertex() {
    const vertex = Math.floor((Math.random() * 3)+1)
    const t3 = new Triangle(cnv, Number(triangleSize), true, "canvas")
    switch(vertex) {
      case 1: {
        return t3.pointA
        
      }
      case 2: {
        return t3.pointB
      }
      case 3: {
        return t3.pointC
      }
    }
    return Math.floor((Math.random() * 3)+1)
  }

  //console.log("virsune", randVertex())

 

  function triangle2(visible=true) {    
    const cnt = clickCount + 1
    const t2 = new Triangle(cnv, Number(triangleSize), true, "canvas")    
    if(!startPos) { 
      clear() 
    } else if (!lastPos) {
      clear()    
      drawPoint(startPos)
    }
    t2.triColor = "white"
    t2.centerColor = "#f5acac"
    if(visible) {
      if (cnt===1) {
        t2.draw()
        setClickCount(oldval => oldval + 1 )
      } else if (cnt===2) {
        t2.drawVertices()
        setClickCount(oldval => oldval + 1 )
      } else {
        setClickCount(0)
      }
      
    }
    //t2.drawMedians()
    //t2.drawCentroid()
    
  }
  function dots2(number=1000) {    
    if (startPos) {
      setWorking(true)
      const ctx = cnv.current.getContext("2d")
      ctx.beginPath()
      // ctx.moveTo(startPos.x, startPos.y)
      let start
      if (lastPos) {
        start = ({x: lastPos.x, y: lastPos.y})
      } else {
        start = ({x: startPos.x, y: startPos.y})
      }


      function countDown(i) {
        const int = setInterval(() => {
          const rvertex = randVertex()
          //straigth line length:
          const fullLine = Math.hypot(rvertex.x - startPos.x, rvertex.y - startPos.y)
          const halfLine = fullLine/2
          const t = halfLine/fullLine
          const halfPoint = {x: (1-t)*start.x + t*rvertex.x , y: (1-t)*start.y + t*rvertex.y }


          ctx.fillStyle = "#FA993E"
          ctx.fillRect(halfPoint.x,halfPoint.y,1,1)
          start.x = halfPoint.x
          start.y = halfPoint.y
          i-- 
          if(i===0) {
            clearInterval(int) 
            setWorking(false)
            setLastPos(halfPoint)
          }
          
          
        }, 1);
      }
      countDown(number);

      ctx.closePath()
    } else {
      alert("Mark a start point anywhere inside the triangle.")
    }
    
    //console.log("finnished")
  }

 function clear() {
    const ctx = cnv.current.getContext("2d");
    ctx.clearRect(0, 0, cnv.current.width, cnv.current.height);
    setLastPos()
  }

  function handleDotNumChange(event) {
    setDotNum(event.target.value)
  }
  function handleTriSizeChange(event) {
    setTriSize(event.target.value)
    
  }

  return (
    <div className='main'>
      <div className='wrapper'>
        <div className='dot-toolbar'>        
          <input 
            type='range' 
            min={1} max={999} 
            className='start-range' 
            name='dotNumber' 
            disabled={working?true:false} 
            value={dotNum} 
            onChange={handleDotNumChange} 
          />
          <label htmlFor="dotNumber">{dotNum}</label>
          <button 
            disabled={working?true:false} 
            className='start-btn' 
            onClick={() => dots2(dotNum)} 
            style={{background: 'transparent', 
            border: "1px solid #000"  }}
          >.</button>
        </div>
        <div className='tri-params-wrapper'>
          <div className='tri-slider'>
            <input 
              type='range' 
              orient='vertical' 
              min={30} max={maxTriSize} 
              className='start-range' 
              name='triangleSize' 
              disabled={working?true:false} 
              value={triangleSize} 
              onChange={handleTriSizeChange} 
            />
            <label htmlFor="triangleSize">{triangleSize}</label>
          
            <button disabled={working?true:false} className='start-btn' onClick={() => triangle2()} >Δ</button>
          </div>
          <canvas className='my-canvas' ref={cnv} width={600} height={600}></canvas>
        </div>
        <div className='footer'>
          <button disabled={working?true:false} className='start-btn back-red' onClick={() => {clear(); setStartPos()}}>x</button>
        </div>
      </div>
      
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Triangle } from './func/triangle_class';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function App() {
  const [dotNum, setDotNum] = React.useState(1)
  const [triangleSize, setTriSize] = React.useState(108)
  const [startPos, setStartPos] = React.useState()
  const [tempStartPos, setTempStartPos] = React.useState()
  const [working, setWorking] = React.useState(false)  
  const [clickCount, setClickCount] = React.useState(0)
  const [lastPos, setLastPos] = React.useState()
  const [maxTriSize, setMaxTriSize] = React.useState(30)
  const [showHelp, setShowHelp] = React.useState(false);

  const handleHelpClose = () => setShowHelp(false);
  const handleHelpShow = () => setShowHelp(true);

  
  const cnv = React.useRef()

  React.useEffect(() => {
    //cnv.current.addEventListener('mousemove', function(evt) {
    cnv.current.addEventListener('click', function(evt) {    
        const mousePos = getMousePos(cnv.current, evt);
        //console.log(startPos)
        if (!working) {          
          const tempPos = {x: mousePos.x, y: mousePos.y}
          setTempStartPos(tempPos)
        }
        //!working && setStartPos({x: mousePos.x, y: mousePos.y})
        //!working && console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    }, false);    

    setMaxTriSize(cnv.current.width/2 - (cnv.current.width/100*3))
    /* cnv.current.addEventListener('mousemove', function(evt) {    
      const mousePos = getMousePos(cnv.current, evt);
            console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    }, false); */
    
  }, [])
  //set canvas size due to windows resize
  React.useEffect(() => {
    window.addEventListener("resize", function() {
      
      resizeCanvas()

      //console.log(canv.height)
    })
    resizeCanvas()
  }, [])

  //console.log(startPos)
  //console.log(cnv.current)
  //triangle size change hook
  React.useEffect(() => {
    const t3 = new Triangle(cnv, Number(triangleSize), true, "canvas")
    setClickCount(0)
  }, [triangleSize])

  //start point hook
  React.useEffect(() => {
    if (!working) {
      if(lastPos) {
        if (window.confirm("Are you sure you want to set new start point? This will erase all data.")) {
          clear()
          setStartPos(getZoomedStartPos(tempStartPos, cnv))          
          setClickCount(0)
          //triangle2(false)
          drawPoint(getZoomedStartPos(tempStartPos, cnv))
        } 
      } else {
        clear()       
        setStartPos(getZoomedStartPos(tempStartPos, cnv))        
        setClickCount(0)
        //triangle2(false)
        drawPoint(getZoomedStartPos(tempStartPos, cnv))
      }
    }  
  }, [tempStartPos])

  React.useEffect(() => {
    triangle2()
  }, [])
  function getZoomedStartPos(rawStartPos, canv) {
    let newStartPos
      const widthStr = canv.current.style.width
      if (widthStr !== "") {
        const widthNum =  Number(widthStr.slice(0, widthStr.length - 2))
        const new_x = canv.current.width * rawStartPos.x / widthNum;
        const new_y = canv.current.height * rawStartPos.y / widthNum;

        newStartPos = {x: new_x, y: new_y}
        //newStartPos = startPos
      } else {
        newStartPos = rawStartPos
      }
      return newStartPos

  }

  function resizeCanvas() {
    const canv = document.getElementById('my-canvas')
      const new_width = window.innerWidth / 100 * 40;
      const new_height = window.innerWidth / 100 * 40;
      if (new_width <= 630 && new_width >= 240)  {
        
        canv.width = new_width
        canv.height = new_height
      // setWIndowWidth(window.innerWidth)
      } else {
        if (new_width < 240) {
          canv.width = 240
          canv.height = 240
        } else if (new_width > 630) {
          canv.width = 630
          canv.height = 630
        }
      }
      setMaxTriSize(canv.width/2 - (canv.width/100*3))
  }

  function drawPoint(point, color="white", size=1) {
    if (point) {
      const ctx = cnv.current.getContext("2d")
      ctx.fillStyle=color
      ctx.fillRect(point.x,point.y,size,size)
      //ctx.fillRect(590,590,3,3)
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
        //console.log(triangleSize)
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
  //resizes canvas. @opt = string with possible values: "in", "out", "reset"
  function zoom(opt="in", minSize=240, maxSize=1000) { 
    const widthStr = cnv.current.style.width
    const styleWidth = widthStr!==""?Number(widthStr.slice(0, widthStr.length - 2)):cnv.current.width
    switch (opt) {
      case "in": {
        if (styleWidth < maxSize) {
          cnv.current.style.width = widthStr !== ""?(styleWidth + 100) + 'px':(Number(cnv.current.width) + 100) + 'px';
          cnv.current.style.height = widthStr !== ""?(styleWidth + 100) + 'px':(Number(cnv.current.width) + 100) + 'px';
          
        } else {
          alert("Max zoom reached!")
        }
        break;
      }
      case "out": {
        if (styleWidth > minSize) {
          cnv.current.style.width = widthStr !== ""?(styleWidth - 100) + 'px':(Number(cnv.current.width) - 100) + 'px';
          cnv.current.style.height = widthStr !== ""?(styleWidth - 100) + 'px':(Number(cnv.current.width) - 100) + 'px';
          
        } else {
          alert("Min zoom reached!")
        }
        break;
      }
      case "reset": {
        cnv.current.style.width = "";
        cnv.current.style.height = "";
        break;
      }
      default: {
        cnv.current.style.width = "";
        cnv.current.style.height = "";
        break;
      }
    }
    //console.log(cnv.current.style.width, cnv.current.style.height)
    
  }

  const renderTooltip = (text, id) => (
    <Tooltip id={"button-tooltip" + id}>
      {text}
    </Tooltip>
  );

  return (
    <div className='main'>
      <Offcanvas show={showHelp} onHide={handleHelpClose} placement='start' >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>About</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='help-content'>
              <p>
              Based on Sierpinski's triangle (Chaos game).<br/>
              Place a start point by mouse click somewhere inside black rectangle (preferably within the borders of the triangle). Now press the "Δ" button to mark triangle boundaries or vertices. Press the "." button to start placing dots. By sliding left and right change the number of dots to be drawn. You can also resize the triangle with the slider on the left and then redraw it by pressing "Δ". Use "+" and "-" buttons to zoom in/out and "X" button to clear all canvas and reset zoom.
              </p>
              <p><strong>Explanation:</strong></p>
              <p className='txt12'>Algorithm draws a straight imaginary line from your given start point to one of three randomly chosen vertices of triangle. Then it draws a dot in the middle of this line. The next imaginary line goes from this new point and new dot half way and so on. Every time vertices are chosen randomly and the same vertex can be chosen any number times in a row. After drawing many points appears triangle fractal. It looks always the same even if a start point placed outside the boundaries of triangle. 
              You can try this by placing dots one by one or take a pencil, ruler and draw it on a paper. The more dots - the clearer fractal drawing. </p>
          </div>
          <p style={{display: "flex", justifyContent: "center"}}><strong>Made by Sulsiperis 2023</strong></p>
        </Offcanvas.Body>
      </Offcanvas>
      <div className='wrapper'>
        <div className='dot-toolbar'>

        <OverlayTrigger
              placement="bottom"
              /* delay={{ show: 250, hide: 400 }} */
              overlay={renderTooltip("Number of dots", 4)}
            >
              <input 
                type='range' 
                min={1} max={999} 
                className='start-range' 
                name='dotNumber' 
                disabled={working?true:false} 
                value={dotNum} 
                onChange={handleDotNumChange} 
              />
            </OverlayTrigger>

          
          <label htmlFor="dotNumber">{dotNum}</label>
          <OverlayTrigger
            placement="left"
            /* delay={{ show: 250, hide: 400 }} */
            overlay={renderTooltip("Start drawing dots", 1)}
          >
            <button 
              disabled={working?true:false} 
              className='start-btn' 
              onClick={() => dots2(dotNum)} 
              style={{background: 'transparent', 
              border: "1px solid #000"  }}
            ><strong>·</strong></button>            
          </OverlayTrigger>



          
        </div>
        <div className='tri-params-wrapper'>
          <div className='tri-slider'>
          <OverlayTrigger
              placement="right"
              /* delay={{ show: 250, hide: 400 }} */
              overlay={renderTooltip("Size of triangle", 3)}
            >
              <input 
              type='range' 
              orient='vertical' 
              min={30} max={maxTriSize} 
              className='start-range-vertical' 
              name='triangleSize' 
              disabled={working?true:false} 
              value={triangleSize} 
              onChange={handleTriSizeChange} 
            />
            </OverlayTrigger>
            
            <label htmlFor="triangleSize">{triangleSize}</label>
            
            <OverlayTrigger
              placement="right"
              /* delay={{ show: 250, hide: 400 }} */
              overlay={renderTooltip("Draw triangle", 2)}
            >
              <button disabled={working?true:false} className='start-btn' onClick={() => triangle2()} ><strong>Δ</strong></button>
            </OverlayTrigger>


            
          </div>
          <canvas className='my-canvas' id="my-canvas" ref={cnv} ></canvas>
        </div>
        <div className='footer'>
          <OverlayTrigger
            placement="left"
            /* delay={{ show: 250, hide: 400 }} */
            overlay={renderTooltip("Help / About", 5)}
          >
            <button className='start-btn help' onClick={() => {handleHelpShow()}}><strong>?</strong></button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="left"
            /* delay={{ show: 250, hide: 400 }} */
            overlay={renderTooltip("Zoom out", 6)}
          >
            <button disabled={working?true:false} className='start-btn' onClick={() => {zoom("out")}}><strong>-</strong></button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="left"
            /* delay={{ show: 250, hide: 400 }} */
            overlay={renderTooltip("Zoom in", 7)}
          >
            <button disabled={working?true:false} className='start-btn' onClick={() => {zoom("in")}}><strong>+</strong></button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="left"
            /* delay={{ show: 250, hide: 400 }} */
            overlay={renderTooltip("Clear canvas and reset zoom", 8)}
            
          >
            <button disabled={working?true:false} className='start-btn back-red' onClick={() => {clear(); zoom("reset"); setClickCount(0); setStartPos()}}><strong>x</strong></button>
          </OverlayTrigger>
          
        </div>
      </div>
      
    </div>
  );
}

export default App;

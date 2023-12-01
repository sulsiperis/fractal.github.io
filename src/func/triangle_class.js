export class Triangle {
    constructor(
            canvas,
            size=100,
            equilateral=true, //false if any other  
            start="centroid", //centroid, canvas or coords 
            pointA={ x: 0, y: 50 }, 
            pointB={ x: 350, y: 75 }, 
            pointC={ x: 55, y: 250 },            
            triColor = "yellow",              
            centerColor = "lime",
            lineSize = 0.3,
            triFill
            
    ) 
    {
        
        this.canvas = canvas;        
        this.start = start;      
        this.triColor = triColor;
        this.triFill = triFill;
        this.centerColor = centerColor;
        this.size = size;
        this.lineSize = lineSize;
        this.X = 0;
        this.Y = 0;
        this.pointA = pointA;
        this.pointB = pointB;
        this.pointC = pointC;

        this.height = (Number(this.size) * 2 * Math.sqrt(3))/2;
        
        if(equilateral) {
            
            switch(start) {
                //center to coincide canvas center with centroid of the triangle
                default: {  //centroid                  
                    const xMid=this.canvas.current.width/2, yMid=this.canvas.current.height/2;
                    this.X=xMid;
                    this.Y=yMid-Number(this.size) / Math.sqrt(3) * 2;                    
                    break;
                    
                }
                //center with equal distance from borders
                case "canvas": {
                    const xMid=this.canvas.current.width/2, yMid=this.canvas.current.height/2;
                    this.X=xMid; 
                    this.Y=yMid-(this.height/2);
                    /* this.pointA = {x: X, y: Y};
                    this.pointB = {x: X+Number(this.size), y: Y+height};
                    this.pointC = {x: X-Number(this.size), y: Y+height}; */
                    break;
                }
                case "coords": {
                    this.X=pointA.x; 
                    this.Y=pointA.y;
                    /* this.pointA = {x: X, y: Y};
                    this.pointB = {x: pointA.x+Number(this.size), y: X+height};
                    this.pointC = {x: pointA.x-Number(this.size), y: Y+height}; */
                    break;
                    
                }
                
            }
            this.pointA = {x: this.X, y: this.Y};
            this.pointB = {x: this.X+Number(this.size), y: this.Y+this.height};
            this.pointC = {x: this.X-Number(this.size), y: this.Y+this.height};
        } else {
            this.pointA = pointA;
            this.pointB = pointB;
            this.pointC = pointC;
        }
       // const X=xMid, Y=yMid-Number(this.size) / Math.sqrt(3) * 2

    }
    
    draw() {


        const ctx = this.canvas.current.getContext("2d");
        ctx.beginPath();
        
        ctx.strokeStyle = this.triColor;
        ctx.lineWidth = this.lineSize;
        ctx.moveTo(this.pointA.x, this.pointA.y);
        ctx.lineTo(this.pointB.x, this.pointB.y);
        ctx.lineTo(this.pointC.x, this.pointC.y);
        ctx.lineTo(this.pointA.x, this.pointA.y);
        if (this.triFill) {
            ctx.fillStyle = this.triFill;
            ctx.fill();
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawVertices() {
        const ctx = this.canvas.current.getContext("2d");
        ctx.fillStyle = this.triColor
        ctx.fillRect(this.pointA.x,this.pointA.y,this.lineSize*2+1,this.lineSize*2+1)
        ctx.fillRect(this.pointB.x,this.pointB.y,this.lineSize*2+1,this.lineSize*2+1)
        ctx.fillRect(this.pointC.x,this.pointC.y,this.lineSize*2+1,this.lineSize*2+1)

    }
    drawMedians() {
      const ctx = this.canvas.current.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = "white";
      //PointA to opposite
      ctx.moveTo(this.pointA.x, this.pointA.y);
      ctx.lineTo(
        (this.pointB.x + this.pointC.x) / 2,
        (this.pointB.y + this.pointC.y) / 2
      );
      //PointB to opposite
      ctx.moveTo(this.pointB.x, this.pointB.y);
      ctx.lineTo(
        (this.pointA.x + this.pointC.x) / 2,
        (this.pointA.y + this.pointC.y) / 2
      );
      //PointC to opposite
      ctx.moveTo(this.pointC.x, this.pointC.y);
      ctx.lineTo(
        (this.pointA.x + this.pointB.x) / 2,
        (this.pointA.y + this.pointB.y) / 2
      );
      ctx.stroke();
      ctx.closePath();
    }
    drawCentroid() {
      const ctx = this.canvas.current.getContext("2d");
      let ox = ((this.pointA.x + this.pointB.x + this.pointC.x) / 3).toFixed(2);
      let oy = ((this.pointA.y + this.pointB.y + this.pointC.y) / 3).toFixed(2);

      ctx.fillStyle = this.centerColor;
      //ctx.font = "12px Arial";
      //ctx.fillText("centroid = x: " + ox + " y: " + oy, 10, 20);
      ctx.fillRect(ox,oy,1,1)

    }
    getCentroid() {
        let ox = ((this.pointA.x + this.pointB.x + this.pointC.x) / 3).toFixed(2);
        let oy = ((this.pointA.y + this.pointB.y + this.pointC.y) / 3).toFixed(2);
        return {x: ox, y: oy}
    }
    getMinMax() {
        return { 
            "x_min": this.X - Number(this.size), 
            "x_max": this.X + Number(this.size), 
            "y_min": this.Y, 
            "y_max": this.Y + this.height  
        }
    }
  }
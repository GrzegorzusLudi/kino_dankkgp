
class Camera {
    constructor(oldCamera){
        this.x = 0
        this.y = 0
        this.magnification = 4
        if(oldCamera !== undefined){
            if(oldCamera.x)
                this.x = oldCamera.x
            if(oldCamera.y)
                this.y = oldCamera.y
            if(oldCamera.magnification)
                this.magnification = oldCamera.magnification
        }
        
        this.moving = false
        this.pixelSize = 1/this.magnification
    }
    
    getX(){ return this.x }
    setX(x){ this.x = x }
    
    getY(){ return this.y }
    setY(y){ this.y = y }
    
    getMouseX() { return this.mouseX }
    getMouseY() { return this.mouseY }
    setMousePosition(x,y) { this.mouseX = x; this.mouseY = y}
    
    degreesToPixels(x,y,bounds,getx){
        return getx 
                ? 
            (this.x + x) * this.magnification + bounds.width/2
                :
            -(this.y + y) * this.magnification + bounds.height/2
    }
    
    pixelsToDegrees(x,y,bounds,getx){
        return getx 
                ?
            (x - bounds.width/2) / this.magnification - this.x
                :
            -(y - bounds.height/2) / this.magnification - this.y
    }
    
    getPixelSize(){
        this.pixelSize = 1 / this.magnification
        return this.pixelSize
    }
    
    // (number of pixels)/1degree, not incremented, but multiplied by a factor
    getMagnification(){ return this.magnification }
    setMagnification(magnification){ 
        var MIN_MAGNIFICATION = 0.5
        var MAX_MAGNIFICATION = 1000
        if(magnification < MIN_MAGNIFICATION)
            this.magnification = MIN_MAGNIFICATION
        else if(magnification > MAX_MAGNIFICATION)
            this.magnification = MAX_MAGNIFICATION
        else
            this.magnification = magnification
    }
    
    startMoving(movx,movy){
        this.startx = this.x
        this.starty = this.y
        this.startmovx = movx
        this.startmovy = movy
        this.movx = movx
        this.movy = movy
        this.moving = true
    }
    actualizeMoving(movx,movy){
        this.movx = movx
        this.movy = movy
        
        this.x = this.startx + (this.movx-this.startmovx) / this.magnification
        this.y = this.starty - (this.movy-this.startmovy) / this.magnification
    }
    stopMoving(){
        this.moving = false
    }
    getDegrees(){
        
    }
    
}
class PlayerPanel {
    constructor(canvasElement,parentDiv){
        this.canvasElement = canvasElement
        this.parentDiv = parentDiv
        this.bounds = null
        this.layerdata = null
        
        this.actualizeBounds()
    }
    wheel(e){
    }
    
    actualizeBounds(){
        var bounds = this.parentDiv.getBoundingClientRect()
        this.bounds = bounds
        
    }
    actualizeElementSize(){
        var bounds = this.parentDiv.getBoundingClientRect()
        this.canvasElement.width = bounds.width
        this.canvasElement.height = bounds.height
        
        this.bounds = bounds
    }
    
}
class Controller {
    constructor(playerElement){
        this.moving = null
        this.leftMoved = null
        this.rightMoved = null
        this.movable = document.getElementById("movable")
        this.movable2 = document.getElementById("movable2")
        this.leftpanel = document.getElementById("leftpanel")
        this.centralpanel = document.getElementById("centralpanel")
        this.rightpanel = document.getElementById("rightpanel")
        
        this.playerElement = playerElement
        this.movable.addEventListener("mousedown",e=>this.mouseDown(e,this.movable,this.leftpanel,this.centralpanel))
        this.movable2.addEventListener("mousedown",e=>this.mouseDown(e,this.movable2,this.centralpanel,this.rightpanel))
        window.addEventListener("mousemove",e=>this.mouseMove(e))
        window.addEventListener("mouseup",e=>this.mouseUp(e))
        window.addEventListener("resize",e=>this.windowResize(e))
        
        this.actualizeCentralPanel()
        this.timeout = undefined
    }
    mouseDown(e,movingElement,leftPanel,rightPanel){
        this.moving = movingElement
        this.leftMoved = leftPanel
        this.rightMoved = rightPanel
        this.startX = e.clientX;
        this.startposLeft = this.leftMoved.getClientRects()[0].width
        this.startposRight = this.rightMoved.getClientRects()[0].width
    }
    mouseMove(e){
        if(this.moving){
            var x = e.clientX;
            var newxLeft = x-this.startX+this.startposLeft;
            
            var newxRight = -x+this.startX+this.startposRight;
            
            if(newxLeft >= 200 && newxRight >= 200){
                var lwidth = Math.max(100,newxLeft)
                var rwidth = Math.max(100,newxRight)
                this.leftMoved.style.width = lwidth+"px"
                this.rightMoved.style.width = rwidth+"px"
            }
            
            this.actualizeCentralPanel()
        }
    }
    mouseUp(e){
        this.moving = false
    }
    wheel(e){
        //scroll? :o
        //this.playerElement.wheel(e)
    }
    windowResize(e){
        this.actualizeCentralPanel()
    }
    actualizeCentralPanel(){
        var lwidth = this.leftpanel.getBoundingClientRect().width
        var rwidth = this.rightpanel.getBoundingClientRect().width
        var bodywidth = document.body.getBoundingClientRect().width
        this.centralpanel.style.width = (bodywidth - lwidth - rwidth - 20*2)+"px"
        
        this.playerElement.actualizeElementSize()
        
        var t = this
        clearTimeout(this.timeout)
        this.timeout = setTimeout(
            function(ev){
                t.playerElement.actualizeBounds()
            }
            ,300)
    }
}
function actualizeBottom(text){
    var bottom = document.getElementById("bottom")
    bottom.innerHTML = text
}
function actualizeBottomWithCoords(camera, bounds){
    var degreesx = camera.pixelsToDegrees(camera.mouseX,camera.mouseY,bounds,true)
    var degreesy = camera.pixelsToDegrees(camera.mouseX,camera.mouseY,bounds,false)
    actualizeBottom(`Coords: ${String(degreesx).slice(0,5)} ${String(degreesy).slice(0,5)}, ${Math.floor(degreesx)}° ${Math.floor((degreesx % 1)*60)}' ${Math.floor(degreesy)}° ${Math.floor((degreesy % 1)*60)}'; magnification: ${String(camera.magnification).slice(0,5)}`)
}
function detectWebGL(){
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl && gl instanceof WebGLRenderingContext
}
function init(){
    
    let stageDiv = document.getElementById("stage")
     let playerPanelElement = document.getElementById("player")
     let playerPanel = new PlayerPanel(playerPanelElement,stageDiv)

     let movlist = new Controller(playerPanel);
    
     /* tutaj niby okna, ale lepsze jakieś zaimportowane jsem :o */
    /*let importWindow = new ImportDialogWindow({
        button: "button-import", 
        element: "layer-import",
        file: "layer-import-file",
        datatype: "layer-import-datatype",
        addlayer: "dialog-window-add",
        layerpanel: layerpanel,
        canvas: canvas,
    })
    let newLayerWindow = new AddLayerDialogWindow({
        button: "button-add-layer", 
        element: "layer-add",
        canvas: canvas,
        layertype: "layer-add-datatype",
        
    })*/
    
    playerPanel.actualizeBounds()
}
addEventListener("load",init);


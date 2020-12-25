
class LayerPanel {
    constructor(configs){
        this.element = null
        this.setConfig(configs)
        this.layers = {
            type:"root",
            name:"root",
            drawable:false,
            children: {}  //dict
        }
        this.updateLayerView(this.layers,null)
    }
    setConfig(configs){
        for(var option in configs){
            switch(option){
                case "element":
                    this.element = document.getElementById(configs[option])
                    break;
            }
        }
    }
    
    //path is array of ids
    //initial data is written in geojson
    addLayer(path, name, type, initialData, bounds, resolution){
        var realpath = this.layers
        for(var i in path){
            var pathpart = path[i]
            realpath = realpath.children[pathpart]
        }
        var transformed = this.validateAndTransformToGeoJson(initialData, type)
        var testname = name
        var number = 2
        while(testname in realpath.children){
            testname = name + " (" + number + ")"
            number++
        }
        realpath.children[testname] = {
            type: type,
            name: testname,
            data: transformed["data"],
            drawable: transformed["drawable"],
            children: {},
            rendered: null,
        }
        this.render(realpath.children[testname], bounds, resolution)
        this.updateLayerView(path)
    }
    
    renderLayers(bounds, resolution){
        for(var i in this.layers.children){
            this.render(this.layers.children[i], bounds, resolution)
        }
    }
    
    render(layer, bounds, resolution){
        layer.rendered = {}
        this.mapLayerToRendered(layer.data,layer.rendered,bounds,resolution)
    }
    
    checkBounds(coordsx, coordsy, bounds){
        return coordsx > bounds.left && coordsy > bounds.top && coordsx < bounds.right && coordsy < bounds.bottom
    }
    checkIfInBound(value, left, right){
        if(value<=left)
            return -1
        if(value<right)
            return 0
        return 1
    }
    
    mapLayerToRendered(layer,rendered,bounds,resolution){
        var lastPositionx = null, lastPositiony = null, penultimalPositionx = null, penultimalPositiony = null, notinbounds = null
        for(var property in layer){
            var value = layer[property]
            if(value instanceof Object && !(value instanceof Array)){
                if(layer instanceof Array && "resolution" in value && value.resolution<resolution*4){
                    break
                }
                if("bbox" in value && (
                    value.bbox[0] > bounds.right || 
                    value.bbox[1] > bounds.bottom || 
                    value.bbox[2] < bounds.left || 
                    value.bbox[3] < bounds.top)
                )
                    continue
                var newObject = {}
                rendered[property] = newObject
                this.mapLayerToRendered(value,newObject,bounds,resolution)
            } else if(layer instanceof Array && value instanceof Array && value.length > 0 && typeof value[0] == "number"){
                
                var posx = Math.min(Math.max(value[0], bounds.left), bounds.right)
                var posy = Math.min(Math.max(value[1], bounds.top), bounds.bottom)
                var wasnotinbounds = notinbounds
                notinbounds = posx !== value[0] || posy !== value[1]
                if(lastPositionx === null){
                    lastPositionx = posx
                    lastPositiony = posy
                    
                    rendered.push([posx,posy])
                } else if(Math.abs(lastPositionx-posx) + Math.abs(lastPositiony-posy) > resolution){
                    if(notinbounds){
                        if(!wasnotinbounds || 
                            this.checkIfInBound(lastPositionx,bounds.left,bounds.right)
                            !==
                            this.checkIfInBound(posx,bounds.left,bounds.right)
                            ||
                            this.checkIfInBound(lastPositiony,bounds.top,bounds.bottom)
                            !==
                            this.checkIfInBound(posy,bounds.top,bounds.bottom)
                        ){
                            rendered.push([posx,posy])
                        }
                            
                    } else {
                        if(wasnotinbounds)
                            rendered.push([lastPositionx,lastPositiony])
                            
                        rendered.push([posx,posy])
                    }
                    lastPositionx = posx
                    lastPositiony = posy
                }
            } else if(value instanceof Array){
                if(layer instanceof Array && "resolution" in value && value.resolution<resolution*4){
                    break
                }
                var newObject = []
                rendered[property] = newObject
                this.mapLayerToRendered(value,newObject,bounds,resolution)
            } else {
                rendered[property] = value
            }
        }
    }
    
    //modification is path
    modifyLayer(path, type, modification){  
        
    }
    getLayers(){
        
    }
    
    updateLayerView(path){
        var element = this.element
        var layers = this.layers
        
        //for(var i in path){   NOT YEET
        //    var pathpart = path[i]
        //    realpath = realpath.children[pathpart]
        //}
        
        element.innerHTML = "<div>root<div>" //remove all
        var subnodes = document.createElement("div")
        element.appendChild(subnodes)
        subnodes.style.marginLeft = "3px"
        subnodes.style.borderLeft = "1px solid gray"
        subnodes.style.paddingLeft = "3px"
        for(var name in layers.children){
            var layer = layers.children[name]
            var newNode = document.createElement("div")
            newNode.innerHTML = "<div>"+layer.name+"</div>"
            subnodes.appendChild(newNode)
        }
    }
    
    validateAndTransformToGeoJson(data, type){
        var newdata, drawable = false
        switch(type){
            case "geojson":
                    newdata = JSON.parse(data)
                    var b = this.addBboxes(newdata)
                    console.log(b.points)
                    drawable = true
                break
            case "json":
                    newdata = JSON.parse(data)
                break
            case "test":
                    newdata = data
                break
        }
        return {
            data: newdata,
            drawable: drawable,
        }
    }
    boxFromPoints(x,y){
        return {
            left: x, 
            right: x,
            top: y,
            bottom: y,
            points: 1,
        }
    }
    mergeBoxes(bbox1,bbox2){
        if(bbox1 == null)
            return {
                left: bbox2.left, 
                right: bbox2.right,
                top: bbox2.top,
                bottom: bbox2.bottom,
                points: bbox2.points,
            }
            
        return {
            left: Math.min(bbox1.left,bbox2.left), 
            right: Math.max(bbox1.right,bbox2.right), 
            top: Math.min(bbox1.top,bbox2.top), 
            bottom: Math.max(bbox1.bottom,bbox2.bottom),
            points: bbox1.points+bbox2.points,
        }
    }
    mergeArrayBoxes(bbox1,bbox2){
        if(bbox1 == null)
            return [bbox2[0],bbox2[1],bbox2[2],bbox2[3]]
            
        return [
            Math.min(bbox1[0],bbox2[0]), 
            Math.min(bbox1[1],bbox2[1]), 
            Math.max(bbox1[2],bbox2[2]), 
            Math.max(bbox1[3],bbox2[3]),
        ]
    }
    getDeepestCoord(elem){
        if(elem instanceof Array){
            for(var i in elem){
                var res = this.getDeepestCoord(elem[i])
                if(res)
                    return this.getDeepestCoord(res)
            }
        } else {
            return elem
        }
        return null
    }
    addBboxes(data){
        var bbox = null
        if(data instanceof Array){
            for(var i in data){
                var elem = data[i]
                if(elem instanceof Array && elem.length>0 && elem[0] instanceof Array){
                    var getBbox = this.addBboxes(elem)
                    bbox = this.mergeBoxes(bbox, getBbox)
                } else {
                    bbox = this.mergeBoxes(bbox, this.boxFromPoints(elem[0], elem[1]))
                }
            }
            if(data.length>0 && data[0] instanceof Array){
                data.resolution = Math.max(Math.abs(bbox.left - bbox.right), Math.abs(bbox.top, bbox.bottom))
                if(data[0].length>0 && data[0][0] instanceof Array){
                    data.sort((x,y)=>y.resolution-x.resolution)
                }
            }
            return bbox
        }
        switch(data.type){
            case "FeatureCollection":
                for(var i in data.features){
                    var newbbox = this.addBboxes(data.features[i])
                    bbox = this.mergeBoxes(bbox,newbbox)
                }
                break
            case "Feature":
                bbox = this.addBboxes(data.geometry)
                break
            case "GeometryCollection":
                for(var i in data.geometries){
                    var newbbox = this.addBboxes(data.geometries[i])
                    bbox = this.mergeBoxes(bbox,newbbox)
                }
                break
            case "MultiPolygon":
            case "Polygon":
            case "MultiLineString":
            case "LineString":
            case "MultiPoint":
            case "Point":
                bbox = this.addBboxes(data.coordinates)
                break
        }
        data.bbox = [bbox.left, bbox.top, bbox.right, bbox.bottom]
        data.pointNumber = bbox.points   //not cannonical
        if(bbox.points > 10000){
            switch(data.type){
                case "FeatureCollection":
                    this.trySplitBigCollection(data,"features")
                    break
                case "GeometryCollection":
                    this.trySplitBigCollection(data,"geometries")
                    break/*
                case "MultiPolygon":
                    this.trySplitBigCollection(data,"coordinates")
                    break*/
            }
        }
        return bbox
    }
    trySplitBigCollection(data,childName){
        var len = data[childName].length
        if(len < 10)
            return
        var childArray = data[childName]
        //if(childArray.length > 0 && "bbox" in childArray[0]){
            if(data.bbox[2]-data.bbox[0] > data.bbox[3]-data.bbox[1])
                childArray.sort((x,y)=>(x.bbox[0] - y.bbox[0])) //grupowanie po długości geograficznej
            else
                childArray.sort((x,y)=>(x.bbox[1] - y.bbox[1])) //grupowanie po szerokości geograficznej
        /*} else {
            childArray.sort((x,y)=>(this.getDeepestCoord(x) - this.getDeepestCoord(y)))
        }*/
        var array1 = [],array2 = [],array3 = []
        var bbox1 = null,bbox2 = null,bbox3 = null
        for(var i in childArray){
            var elem = childArray[i]
            var bbox = elem.bbox
            if(i < Math.floor(len/3)){
                array1.push(elem)
                bbox1 = this.mergeArrayBoxes(bbox1,bbox)
            } else if(i <= Math.floor(len*2/3)){
                array2.push(elem)
                bbox2 = this.mergeArrayBoxes(bbox2,bbox)
            } else {
                array3.push(elem)
                bbox3 = this.mergeArrayBoxes(bbox3,bbox)
            }
        }
        data[childName] = [
            {
                type: "Interval",
                bbox: bbox1,
                children: array1,
            },
            {
                type: "Interval",
                bbox: bbox2,
                children: array2,
            },
            {
                type: "Interval",
                bbox: bbox3,
                children: array3,
            },
        ]
        this.trySplitBigCollection(data[childName][0],"children")
        this.trySplitBigCollection(data[childName][1],"children")
        this.trySplitBigCollection(data[childName][2],"children")
    }
}










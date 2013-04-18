//
// site.js
//
// the arbor.js website
//

(function($){
  // var trace = function(msg){
  //   if (typeof(window)=='undefined' || !window.console) return
  //   var len = arguments.length, args = [];
  //   for (var i=0; i<len; i++) args.push("arguments["+i+"]")
  //   eval("console.log("+args.join(",")+")")
  // }  
  
  var Renderer = function(elt){
    var dom = $(elt)
    var canvas = dom.get(0)
    var ctx = canvas.getContext("2d");
    var gfx = arbor.Graphics(canvas)
    var sys = null

    var _vignette = null
    var selected = null,
        nearest = null,
        _mouseP = null;

        var w = dom.attr('width');
        var h = dom.attr('height');
        


    var that = {
      init:function(pSystem){
        sys = pSystem
        sys.screen({size:{width:dom.width(), height:dom.height()},
                    padding:[36,60,36,60]})

        

        $(window).resize(that.resize)
        that.resize()
        that._initMouseHandling()

        if (document.referrer.match(/echolalia|atlas|halfviz/)){
          // if we got here by hitting the back button in one of the demos, 
          // start with the demos section pre-selected
          that.switchSection('demos')
        }
      },
      resize:function(){
        canvas.width = $(window).width()
        canvas.height = $(window).height()-80
        
        if(window.devicePixelRatio == 2) {
            canvas.width *= 2;
            canvas.height *= 2;
            dom.css('width', canvas.width/2);
            dom.css('height', canvas.height/2);
            ctx.scale(2, 2);
            sys.screen({size:{width:canvas.width/2, height:canvas.height/2}})
        }
        else
            sys.screen({size:{width:canvas.width, height:canvas.height}})


        _vignette = null
        that.redraw()
      },
      redraw:function(){
        gfx.clear()
        sys.eachEdge(function(edge, p1, p2){
          if (edge.source.data.alpha * edge.target.data.alpha == 0) return
          gfx.line(p1, p2, {stroke:"#cccdcd", width:2, alpha:edge.target.data.alpha})
        })
        sys.eachNode(function(node, pt){
          var w = Math.max(30, 30+gfx.textWidth(node.name) )
          if (node.data.alpha===0) return
          if (node.data.shape=='dot'){
            gfx.oval(pt.x-w/2, pt.y-w/2, w, w, {fill:node.data.color, alpha:node.data.alpha})
            gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"HelveticaNeue-UltraLight", size:14})
            gfx.text(node.name, pt.x, pt.y+7, {color:"white", align:"center", font:"HelveticaNeue-UltraLight", size:14})
          }else{
            gfx.rect(pt.x-w/2, pt.y-10, w, 24, 4, {fill:node.data.color, alpha:node.data.alpha})
            gfx.text(node.name, pt.x, pt.y+9, {color:"white", align:"center", font:"HelveticaNeue-UltraLight", size:14})
            gfx.text(node.name, pt.x, pt.y+9, {color:"white", align:"center", font:"HelveticaNeue-UltraLight", size:14})
          }
        })
        
      },

      switchMode:function(e){
        if (e.mode=='hidden'){
          dom.stop(true).fadeTo(e.dt,0, function(){
            if (sys) sys.stop()
            $(this).hide()
          })
        }else if (e.mode=='visible'){
          dom.stop(true).css('opacity',0).show().fadeTo(e.dt,1,function(){
            that.resize()
          })
          if (sys) sys.start()
        }
      },
      
      switchSection:function(newSection){
        var parent = sys.getEdgesFrom(newSection)[0].source
        var children = $.map(sys.getEdgesFrom(newSection), function(edge){
          return edge.target
        })
        
        sys.eachNode(function(node){
          if (node.data.shape=='dot') return // skip all but leafnodes

          var nowVisible = ($.inArray(node, children)>=0)
          var newAlpha = (nowVisible) ? 1 : 0
          var dt = (nowVisible) ? .5 : .5
          sys.tweenNode(node, dt, {alpha:newAlpha})

          if (newAlpha==1){
            node.p.x = parent.p.x + .05*Math.random() - .025
            node.p.y = parent.p.y + .05*Math.random() - .025
            node.tempMass = .001
          }
        })
      },
      
      
      _initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        selected = null;
        nearest = null;
        var dragged = null;
        var oldmass = 1

        var _section = null

        var handler = {
          moved:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = sys.nearest(_mouseP);

            if (!nearest.node) return false

            //if (nearest.node.data.shape!='dot'){
              selected = (nearest.distance < 50) ? nearest : null
              if (selected){
                 dom.addClass('linkable')
                 //window.status = selected.node.data.link.replace(/^\//,"http://"+window.location.host+"/").replace(/^#/,'')
              }
              else{
                 dom.removeClass('linkable')
                 window.status = ''
              }
            //}else 
            if ($.inArray(nearest.node.name, ['Eye Tracker Experiment','Tester 1','Tester 2','Tester 3',
                          'Tester 4', 'Tester 5','Tester 6', 'Tester 7','Tester 8']) >=0 ){
              if (nearest.node.name!=_section){
                _section = nearest.node.name
                that.switchSection(_section)
              }
              dom.removeClass('linkable')
              window.status = ''
            }
            
            return false
          },
          clicked:function(e){
            console.log("click")
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            nearest = dragged = sys.nearest(_mouseP);
            
            if (nearest && selected && nearest.node===selected.node){
              var link = selected.node.data.link
              if (link.match(/^#/)){
                 $(that).trigger({type:"navigate", path:link.substr(1)})
              }else{
                 window.location = link
              }
              return false
            }
            
            
            if (dragged && dragged.node !== null) dragged.node.fixed = true

            $(canvas).unbind('mousemove', handler.moved);
            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var old_nearest = nearest && nearest.node._id
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (!nearest) return
            if (dragged !== null && dragged.node !== null){
              var p = sys.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null;
            // selected = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            $(canvas).bind('mousemove', handler.moved);
            _mouseP = null
            return false
          }


        }

        $(canvas).mousedown(handler.clicked);
        $(canvas).mousemove(handler.moved);

      }
    }
    
    return that
  }
  
  
  var Nav = function(elt){
    var dom = $(elt)

    var _path = null
    
    var that = {
      init:function(){
        $(window).bind('popstate',that.navigate)
        dom.find('> a').click(that.back)
        $('.more').one('click',that.more)
        
        $('#docs dl:not(.datastructure) dt').click(that.reveal)
        that.update()
        return that
      },
      more:function(e){
        $(this).removeAttr('href').addClass('less').html('&nbsp;').siblings().fadeIn()
        $(this).next('h2').find('a').one('click', that.less)
        
        return false
      },
      less:function(e){
        var more = $(this).closest('h2').prev('a')
        $(this).closest('h2').prev('a')
        .nextAll().fadeOut(function(){
          $(more).text('creation & use').removeClass('less').attr('href','#')
        })
        $(this).closest('h2').prev('a').one('click',that.more)
        
        return false
      },
      reveal:function(e){
        $(this).next('dd').fadeToggle('fast')
        return false
      },
      back:function(){
        _path = "/"
        if (window.history && window.history.pushState){
          window.history.pushState({path:_path}, "", _path);
        }
        that.update()
        return false
      },
      navigate:function(e){
        var oldpath = _path
        if (e.type=='navigate'){
          _path = e.path
          if (window.history && window.history.pushState){
             window.history.pushState({path:_path}, "", _path);
          }else{
            that.update()
          }
        }else if (e.type=='popstate'){
          var state = e.originalEvent.state || {}
          _path = state.path || window.location.pathname.replace(/^\//,'')
        }
        if (_path != oldpath) that.update()
      },
      update:function(){
        var dt = 'fast'
        if (_path===null){
          // this is the original page load. don't animate anything just jump
          // to the proper state
          _path = window.location.pathname.replace(/^\//,'')
          dt = 0
          dom.find('p').css('opacity',0).show().fadeTo('slow',1)
        }

        switch (_path){
          case '':
          case '/':
          dom.find('p').text('Eye Tracker Experiment')
          dom.find('> a').removeClass('active').attr('href','#')

          $('#docs').fadeTo('fast',0, function(){
            $(this).hide()
            $(that).trigger({type:'mode', mode:'visible', dt:dt})
          })
          document.title = "arbor.js"
          break
          
          case 'introduction':
          case 'reference':
          $(that).trigger({type:'mode', mode:'hidden', dt:dt})
          dom.find('> p').text(_path)
          dom.find('> a').addClass('active').attr('href','#')
          $('#docs').stop(true).css({opacity:0}).show().delay(333).fadeTo('fast',1)
                    
          $('#docs').find(">div").hide()
          $('#docs').find('#'+_path).show()
          document.title = "arbor.js » " + _path
          break
        }
        
      }
    }
    return that
  }
  
  $(document).ready(function(){

var CLR = {
  center:"#f0595f",
  tester:"#cccdcd",
  experiment:"#587391",
  line:"#cccdcd"
}

var testerNum = 8;
var trialNum = 3;
  
  
var theUI = {"nodes": 
  {"Eye Tracker Experiment":{"color":"#f0595f", "shape":"dot", "alpha":1, "link":"#reference"},
   "Tester 1":{"color": "#cccdcd", "shape":"dot", "alpha": 1},
   "Experiment 11":{"color": "#587391", "alpha": 0, "link":"/experiment-1-1"},
   "Experiment 12":{"color": "#587391", "alpha": 0, "link":"/experiment-1-2"},
   "Experiment 13":{"color": "#587391", "alpha": 0, "link":"/experiment-1-3"},
   "Tester 2":{"color": "#cccdcd", "shape":"dot", "alpha": 1, "link":"#reference"},
   "Experiment 21":{"color": "#587391", "alpha": 0, "link":"/experiment-2-1"},
   "Experiment 22":{"color": "#587391", "alpha": 0, "link":"/experiment-2-2"},
   "Experiment 23":{"color": "#587391", "alpha": 0, "link":"/experiment-2-3"},
   "Tester 3":{"color": "#cccdcd", "shape":"dot", "alpha": 1},
   "Experiment 31":{"color": "#587391", "alpha": 0, "link":"/experiment-3-1"},
   "Experiment 32":{"color": "#587391", "alpha": 0, "link":"/experiment-3-2"},
   "Experiment 33":{"color": "#587391", "alpha": 0, "link":"/experiment-3-3"},
   "Tester 4":{"color": "#cccdcd", "shape":"dot", "alpha": 1},
   "Experiment 41":{"color": "#587391", "alpha": 0, "link":"/experiment-4-1"},
   "Experiment 42":{"color": "#587391", "alpha": 0, "link":"/experiment-4-2"},
   "Experiment 43":{"color": "#587391", "alpha": 0, "link":"/experiment-4-3"},
   "Tester 5":{"color": "#cccdcd", "shape":"dot", "alpha": 1},
   "Experiment 51":{"color": "#587391", "alpha": 0, "link":"/experiment-5-1"},
   "Experiment 52":{"color": "#587391", "alpha": 0, "link":"/experiment-5-2"},
   "Experiment 53":{"color": "#587391", "alpha": 0, "link":"/experiment-5-3"},
   "Tester 6":{"color": "#cccdcd", "shape":"dot", "alpha": 1},
   "Experiment 61":{"color": "#587391", "alpha": 0, "link":"/experiment-6-1"},
   "Experiment 62":{"color": "#587391", "alpha": 0, "link":"/experiment-6-2"},
   "Experiment 63":{"color": "#587391", "alpha": 0, "link":"/experiment-6-3"},
   "Tester 7":{"color": "#cccdcd", "shape":"dot", "alpha": 1},
   "Experiment 71":{"color": "#587391", "alpha": 0, "link":"/experiment-7-1"},
   "Experiment 72":{"color": "#587391", "alpha": 0, "link":"/experiment-7-2"},
   "Experiment 73":{"color": "#587391", "alpha": 0, "link":"/experiment-7-3"},
   "Tester 8":{"color": "#cccdcd", "shape":"dot", "alpha": 1},
   "Experiment 81":{"color": "#587391", "alpha": 0, "link":"/experiment-8-1"},
   "Experiment 82":{"color": "#587391", "alpha": 0, "link":"/experiment-8-2"},
   "Experiment 83":{"color": "#587391", "alpha": 0, "link":"/experiment-8-3"},
  }, 
  "edges": {

    "Eye Tracker Experiment":{
      "Tester 1":{"length":10},
      "Tester 2":{"length":10},
      "Tester 3":{"length":10},
      "Tester 4":{"length":10},
      "Tester 5":{"length":10},
      "Tester 6":{"length":10},
      "Tester 7":{"length":10},
      "Tester 8":{"length":10}
        },
        "Tester 1":{
          "Experiment 11":{"length":5},
          "Experiment 12":{"length":5},
          "Experiment 13":{"length":5}
        },
        "Tester 2":{
          "Experiment 21":{"length":5},
          "Experiment 22":{"length":5},
          "Experiment 23":{"length":5}
        },
        "Tester 3":{
          "Experiment 31":{"length":5},
          "Experiment 32":{"length":5},
          "Experiment 33":{"length":5}
        },
        "Tester 4":{
          "Experiment 41":{"length":5},
          "Experiment 42":{"length":5},
          "Experiment 43":{"length":5}
        },
        "Tester 5":{
          "Experiment 51":{"length":5},
          "Experiment 52":{"length":5},
          "Experiment 53":{"length":5}
        },
        "Tester 6":{
          "Experiment 61":{"length":5},
          "Experiment 62":{"length":5},
          "Experiment 63":{"length":5}
        },
        "Tester 7":{
          "Experiment 71":{"length":5},
          "Experiment 72":{"length":5},
          "Experiment 73":{"length":5}
        },
        "Tester 8":{
          "Experiment 81":{"length":5},
          "Experiment 82":{"length":5},
          "Experiment 83":{"length":5}
        }
  }
};
  


  var CLR = {
  center:"#b2b19d",
  tester:"#cccdcd",
  experiment:"#587391",
  line:"#cccdcd"
}


  var sys = arbor.ParticleSystem()
    sys.parameters({stiffness:900, repulsion:2000, gravity:true, dt:0.015})
    sys.renderer = Renderer("#sitemap")
    sys.graft(theUI)
    
    var nav = Nav("#nav")
    $(sys.renderer).bind('navigate', nav.navigate)
    $(nav).bind('mode', sys.renderer.switchMode)
    nav.init()



/*
     var theUI = {
      nodes:{"Eye Tracker Experiment":{color:CLR.center, shape:"dot", alpha:1, link:'#referen'}, 
      
             demos:{color:CLR.branch, shape:"dot", alpha:1}, 
             halfviz:{color:CLR.demo, alpha:0, link:'/halfviz'},
             atlas:{color:CLR.demo, alpha:0, link:'/atlas'},
             echolalia:{color:CLR.demo, alpha:0, link:'/echolalia'},

             docs:{color:CLR.branch, shape:"dot", alpha:1}, 
             reference:{color:CLR.doc, alpha:0, link:'#referen'},
             introduction:{color:CLR.doc, alpha:0, link:'#introduction'},

             code:{color:CLR.branch, shape:"dot", alpha:1},
             github:{color:CLR.code, alpha:0, link:'https://github.com/samizdatco/arbor'},
             ".zip":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.zip'},
             ".tar.gz":{color:CLR.code, alpha:0, link:'/js/dist/arbor-v0.92.tar.gz'}
            },
      edges:{
        "Eye Tracker Experiment":{
          demos:{length:1.2},
          docs:{length:1.2},
          code:{length:1.2}
        },
        demos:{halfviz:{},
               atlas:{},
               echolalia:{}
        },
        docs:{reference:{},
              introduction:{}
        },
        code:{".zip":{},
              ".tar.gz":{},
              "github":{}
        }
      }
    }

*/

    
  })
})(this.jQuery)
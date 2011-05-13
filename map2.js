function load () {
	
	var map = document.getElementById("map");
	var nomeMeses = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dec" ];
	
	if (GBrowserIsCompatible()) {

		var gmap = new GMap2(map);
		gmap.addControl( new GSmallMapControl() );
		gmap.addControl( new GMapTypeControl()) ;
		gmap.addControl( new GOverviewMapControl(new GSize(100,100)) );		
		gmap.setCenter ( new GLatLng(-29.53,-53.39), 7);
		
		function makeIcon () {
			var baseIcon = new GIcon(G_DEFAULT_ICON);
            baseIcon.shadow = "http://www.google.com/mapfiles/shadow50.png";
            baseIcon.image = "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
            baseIcon.iconSize = new GSize(20, 34);
            baseIcon.shadowSize = new GSize(37, 34);
            baseIcon.iconAnchor = new GPoint(9, 34);
            baseIcon.infoWindowAnchor = new GPoint(9, 2);
			return baseIcon;
		}
		
		function formatTabOne (input) {				
			var html 	 = "<div class=\"bubble\" style=\"overflow:auto;width:700px;height:300px\">";
			html 		+= "<h1>"+input.titulo+"</h1>";
			info = "";
 			//input.info.sort(function(a,b){return a.quantidade - b.quantidade});
 			//input.info.reverse();
 			
 			var mapa = {};
// 			alert(input.info.length);
 			for (var i = 0; i < input.info.length; i++) {
 			    var o = input.info[i].ocorrencia;
//			    alert(input.info[i].data+" - "+new Date(input.info[i].data));
 			    if( !(o in mapa) ) {
			        mapa[o] = {};
			    } else {
			        var data = new Date(input.info[i].data);
			        mapa[o][data] = input.info[i].quantidade;
			    }
			}
 			
 			limite = input.info.length;
 			//limite = Math.min(10, input.info.length);
			for (var i = 0; i < limite; i++) {
    			var o = input.info[i].ocorrencia;
//			    info += "<br>"+input.info[i].ocorrencia + " " + input.info[i].data + " "+ input.info[i].quantidade;
     			var datas = [];
     			for(var d in mapa[o]) {
     			    datas.push(new Date(d));
     			}
     			
     			// se não há informação então não gera o gráfico
     			if(datas.length == 0) 
     			    continue;
     			
                datas.sort();
                var meses = "";//"|Jan|Fev|Mar";
                var valores = "";//"50,40,80";
                var maxi = 0;
                var last = 0; // ajuste para apresentar grafico com apenas 1 valor
                for(var d in mapa[o]) {
                    var valor = mapa[o][d];
                    meses += "|" + nomeMeses[new Date(d).getMonth()];
                    valores += valor+",";
                    if(parseInt(valor) > maxi) maxi = parseInt(valor);
                    last = valor;
                }
                //valores = valores.substring(0, valores.length-1);
                valores += valor; // repete ultimo valor
                
                var url = "http://chart.apis.google.com/chart"+
                            "?chxl=0:"+meses+
                            "&chxr=1,0,"+(maxi+5)+
                            "&chxt=x,y"+
                            "&chs=300x150"+
                            "&cht=lc"+
                            "&chds=0,"+(maxi+5)+
                            "&chd=t:"+valores+
                            "&chdl="+o.replace(/\s/g, "+")+
                            "&chdlp=t"+
                            "&chg=25,25"+
                            "&chls=0.75,-1,-1";
                info += "<img src="+url+">";
			}
			
			html 		+= "<p>" + info + "</p>";
			html		+= "</div>";					
			return html;			
		}
		
		function sortByValue(keyArray, valueMap) {
            return keyArray.sort(function(a,b){return valueMap[a] < valueMap[b];});
        }
		
		function formatTabTwo (input) {
			var html 	 = "<div class=\"bubble\">";
			html 		+= "<h1>" + input.homeTeam + " - " + input.awayTeam + "</h1>";
			html		+= "<p>"
			if(input.fixture != null) {
				html 	+= "<strong>Starts:</strong> " + input.fixture + "<br />";
			}		
			if(input.capacity != null) {
				html 	+= "<strong>Capacity:</strong> " + input.capacity + "<br />";
			}
			if(input.previousScore != null) {
				html 	+= " " + input.previousScore + "<br />";
			}
			if(input.tv != null) {
				html 	+= " " + input.tv + "<br />";
			}
			html 		+= "</p></div>";					
			return html;			
		}
					
	    function createMarker(input) {
			var marker = new GMarker(new GLatLng(input.latitude, input.longitude), makeIcon());
			GEvent.addListener(marker, "click", function() {
			    var tabs_array	= [ new GInfoWindowTab("Preview", formatTabOne(input) ) ];
				marker.openInfoWindowTabsHtml(tabs_array);
			});
			
			return marker;
		}

		function parseJson (doc) {
//		    doc = doc.replace("\"new GLatLng", "new GLatLng");
//          doc = doc.replace("\"}},", "}},");
			var jsonData = eval("(" + doc + ")");
	        for (var i = 0; i < jsonData.data.length; i++) {
				var marker = createMarker(jsonData.data[i]);
				gmap.addOverlay(marker);
			}			
		}     	
		
		GDownloadUrl("database.json", function(data, responseCode) { 
			parseJson(data);
		});
	
	} else {
		alert("Sorry, your browser cannot handle the true power of Google Maps");
	}
}
window.onload = load;
window.onunload = GUnload;

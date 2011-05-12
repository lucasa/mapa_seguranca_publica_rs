function load () {
	
	var map = document.getElementById("map");
	
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
			var html 	 = "<div class=\"bubble\" style=\"overflow:auto;height:300px\">";
			html 		+= "<h1>"+input.titulo+"</h1>";
			info = "";
 			//input.info.sort(function(a,b){return a.quantidade - b.quantidade});
 			//input.info.reverse();
 			
 			var mapa = {};
// 			alert(input.info);
 			for (var i = 0; i < input.info.length; i++) { 			
//			    alert(input.info[i].data+" - "+new Date(input.info[i].data));
 			    if(! input.info[i].ocorrencia in mapa) {
			        mapa[input.info[i].ocorrencia] = {};
			    } else {
			        mapa[input.info[i].ocorrencia][new Date(input.info[i].data)] = input.info[i].quantidade;
			    }
			}
 			
// 			limite = input.info.length;
 			limite = Math.min(2, input.info.length);
			for (var i = 0; i < limite; i++) {
//			    info += "<br>"+input.info[i].ocorrencia + " " + input.info[i].data + " "+ input.info[i].quantidade;
                mapa[input.info[i].ocorrencia].sort(function(a,b){return a < b});
                var maxi = 0;
                var valores = [input.info[i].ocorrencia];
                for (var j = 0; j < limite; j++) {
                    if(maxi < input.info[i].quantidade)
                        maxi = input.info[i].quantidade;
                }
                url = "http://chart.apis.google.com/chart"+
                       "?chxl=0:|Jan|Feb|Mar|Jun|Jul|Aug|Set|Out|Nov|Dez"+
                       "&chxr=1,0,"+maxi
                       "&chxt=x,y"+
                       "&chs=300x110"+
                       "&cht=lc"+
                       "&chd=t:50.035,58.398,81.091,91.174,82.181,78.901"+
                       "&chdl=Ocorrências"+
                       "&chg=25,25"+
                       "&chls=0.75"+
                       "&chtt=Dado+de+Segurança+Pública+de+"+input.info[i].cidade;
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
    	    //alert(input.latitude +","+ input.longitude);
			var marker = new GMarker(new GLatLng(input.latitude, input.longitude), makeIcon());
			var tabs_array	= [ new GInfoWindowTab("Preview", formatTabOne(input) ) ];
			GEvent.addListener(marker, "click", function() {
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

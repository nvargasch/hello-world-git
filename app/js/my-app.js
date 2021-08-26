var pathApp = 'http://api.mountrexs.com/apptoke/';
var apacheCordova = 'none';
var backDisabledPageInit = 'false';
var ipwifi= '';


document.addEventListener("deviceready", function(){apacheCordova = 'yes';}, false);


/**************
   Framework7  
***************/

var myApp = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'Apptoke',
  // App id
  id: 'com.apptoke.app',
    
  
  // Add default routes
  routes: [
    {
      path: '/login/',
      url: './index.html',
    },
    {
      path: '/home/:nombre',
      url: './page/home.html',	  
    },
    {
      path: '/artista/',
      url: './page/artista.html',
    },
    {
      path: '/cancion/',
      url: './page/cancion.html',
    },
    {
      path: '/generomusical/',
      url: './page/generomusical.html',
    },
    {
      path: '/misfavoritos/',
      url: './page/misfavoritos.html',
    },	
    {
      path: '/pedido/:id',
      url: './page/pedido.html',
    },		
  ],
  
  // ... other parameters
  material: true,  // Enable Material theme
  init: false, 	 // Disable App's automatic initialization  
  pushState: false
  
});



document.addEventListener('deviceready', function () {	
	// Set your iOS Settings
	var iosSettings = {};
	iosSettings["kOSSettingsKeyAutoPrompt"] = false;
	iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
	
	window.plugins.OneSignal
	  .startInit("1eaeb16a-e01e-441c-9794-1bd1dbb13b0f")
	  .iOSSettings(iosSettings)    
	  .endInit();  
	window.plugins.OneSignal.getIds(function(ids) {
		  keyAppCliente(device.uuid, ids.userId);
		  //alert("player id: " + ids.userId);
	  });
		  
  }, false);
	  

myApp.init();
 
var $$ = Dom7;  // Acceso DOM
var mainView = myApp.views.create('.view-main', {preloadPreviousPage: true});  // Add main view


$$(document).on('click', '.login-invitado', function(e){

	if( checkConnection() === 0 ){
		return 0;
	}
					
	var data = {
		id:"YmtapptkhMA==",
		nombre:"INVITADO",
		password:"123456"
	};
	
				
	localStorage.removeItem('jsonLogin');	
	localStorage.setItem('jsonLogin', JSON.stringify(data));
	
	var jsonData = localStorage.getItem('jsonLogin');
	var usuario  = JSON.parse(jsonData).id;
	strdata=desencript(usuario);
	keyuser=strdata.replace("bka","");
	
	conexionApp( keyuser, JSON.parse(jsonData).password );
	
});	
	
		

$$(document).on('click', '.login', function(e){
		
	if( checkConnection() === 0 ){
		return 0;
	}


	var promesa1 = function() {
		return new Promise(function(resolver) {
				
			if(apacheCordova === 'yes'){
			//	ipwifi = 'http://192.168.101.100/minegocio/datos.json'+'?'+Math.random();
			//}else{
				networkinterface.getWiFiIPAddress( onSuccess, onError );
			}
			resolver();
		});
	}


	var promesa2 = function() {
		return new Promise(function(resolver) {
			credencialApp(ipwifi);
			resolver();
		});
	}

	promesa1().then(promesa2);
	
				

});	





function credencialApp(ipurl){
	
	//Busca credenciales.
	
	myApp.request({
		async: true,
		type: 'get',
		url: ipurl,
		dataType: 'json',
		success: function(obj){
			
			strdata=desencript(obj[0].id);
			keyuser=strdata.replace("bka","");
								
			localStorage.removeItem('jsonLogin');
			localStorage.setItem('jsonLogin', JSON.stringify(obj[0]));
				
			conexionApp(keyuser, obj[0].password);
					
				
		 },
		error: function() {
			myApp.dialog.alert('No se encontraron las credenciales de acceso, intentelo nuevamente.', 'Aviso');
		  }
		});
		
		
};



function conexionApp( usuario, password ){
	
    if (usuario == '') {
        myApp.dialog.alert("Credenciales incorrectas","Aviso");
    } else if (password == '') {
        myApp.dialog.alert("Credenciales incorrectas","Aviso");
    } else {
	

		myApp.request({
		async: true,
		type: 'get',
		url:  pathApp+'public/app-login',
		dataType: 'json',
		data: {user: usuario, pass: password},
		success: function(obj){					
			
			if(obj[0].message=='0'){
												
				x_nombres = obj[0].nom_empresa;
				mainView.router.navigate ('/home/'+ x_nombres);	
								
				localStorage.removeItem('jsonUsuario');				
				localStorage.setItem('jsonUsuario', JSON.stringify(obj[0]));
				
			}else{
				mensaje = obj[0].message;
				myApp.dialog.alert(mensaje, 'Aviso');
			}
			
				
		 },
		error: function() {
			myApp.dialog.alert('No se ha podido procesar la información.', 'Error');
		  }
		}); 		
		
		
	}
	
};




$$(document).on('page:init', '.page[data-name="home"]', function (page){
	
	var x_nombres = mainView.router.currentRoute.params.nombre;	
			
	if(typeof x_nombres === 'undefined'){
		var jsonData  = localStorage.getItem('jsonUsuario');
		var x_nombres = JSON.parse(jsonData).nom_empresa;		
	}
	
	$$('#title-home').text(x_nombres);
	$$('#username').val("");
	
	/*	
	window.plugins.OneSignal.getPermissionSubscriptionState(function(status) {
	  //status.subscriptionStatus.pushToken; // String: Device Identifier from FCM/APNs	  
	  myApp.dialog.alert('Prueba: '+status.subscriptionStatus.userId);	  
	});	
	*/
	backDisabledPageInit=false;	
	
});






/************
   swiper  
************/


//myApp.onPageInit('artista', function (page){

$$(document).on('page:init', '.page[data-name="artista"]', function(e){	
	
	var mySwiper01 = myApp.swiper.create('.swiper-container',{	
		pagination:'.swiper-pagination',
		init:true,
		loop:false,
		initialSlide: 0,
		observer: true,
		simulateTouch: true,
		watchActiveIndex: true,
		preventClicks: true,
		preventClicksPropagation: true,
			  
		on: {  
		  init: function() {
			  
			  if(backDisabledPageInit=='true'){
				  backDisabledPageInit=false;
				  return 0;
			  }
				
		  	  document.getElementById('parameters').elements[3].value = 'uno'; //Tipo busqueda
			  busqueda('uno');
			  
		  },
		  slideNextTransitionEnd: function() {			  			  					 
			  var pageActive = mySwiper01.activeIndex+1; /*Activo slide*/
			  var pageLast = mySwiper01.slides.length;   /*Último slide*/
			  			  
			  loadNewSlides('paginacion', pageActive, pageLast);			  
			  mySwiper01.update();			  
			  			  			  						 
		  },		
		}
		
	});	
});



$$(document).on('page:init', '.page[data-name="cancion"]', function(e){	
		
	var mySwiper02 = myApp.swiper.create('.swiper-container-cancion',{	
		pagination:'.swiper-pagination',
		init:true,
		loop:false,
		initialSlide: 0,
		observer: true,
		simulateTouch: true,
		watchActiveIndex: true,
		preventClicks: true,
		preventClicksPropagation: true,
	  		  
		on: {
		  init: function() {
	  
			  if(backDisabledPageInit=='true'){
				  backDisabledPageInit=false;
				  return 0;
			  }			  
			  
			  document.getElementById('parameters').elements[3].value = 'dos'; //Tipo busqueda
			  busqueda('dos');			  
			  
		  },
		  slideNextTransitionEnd: function() {			  
			  var pageActive = mySwiper02.activeIndex+1; /*Activo slide*/
			  var pageLast = mySwiper02.slides.length;   /*Último slide*/
			  
			  loadNewSlides('paginacion-cancion', pageActive, pageLast);
			  mySwiper02.update();
			  
		  },		
		}
		
	});	
});




$$(document).on('page:init', '.page[data-name="generomusical"]', function(e){

	var mySwiper03 = myApp.swiper.create('.swiper-container-genero',{	
		pagination:'.swiper-pagination',
		init:true,
		loop:false,
		initialSlide: 0,
		observer: true,
		simulateTouch: true,
		watchActiveIndex: true,
		preventClicks: true,
		preventClicksPropagation: true,
	  
		on: {
		  init: function() {			  
				
			  if(backDisabledPageInit=='true'){
				  backDisabledPageInit=false;
				  return 0;
			  }			  
			  
			  document.getElementById('parameters').elements[3].value = 'tres'; //Tipo busqueda
			  busqueda('tres');
			  			  
		  },
		  slideNextTransitionEnd: function() {			  
			  var pageActive = mySwiper03.activeIndex+1; /*Activo slide*/
			  var pageLast = mySwiper03.slides.length;   /*Último slide*/
			  			  
			  loadNewSlides('paginacion-genero', pageActive, pageLast);
			  mySwiper03.update();
			  
			  			  
		  },		
		}
		
	});	
});



	
$$(document).on('page:init', '.page[data-name="misfavoritos"]', function(e){	
	
	var mySwiper04 = myApp.swiper.create('.swiper-container-misFavoritos',{	
		pagination:'.swiper-pagination',
		init:true,
		loop:false,
		initialSlide: 0,
		observer: true,
		simulateTouch: true,
		watchActiveIndex: true,
		preventClicks: true,
		preventClicksPropagation: true,
	  
		on: {
		  init: function() {
			  			  
			  if(backDisabledPageInit=='true'){
				  backDisabledPageInit=false;
				  return 0;
			  }			  
			  
			  document.getElementById('parameters').elements[3].value = 'cuatro'; 
			  
			  if(apacheCordova === 'yes'){
				document.getElementById("criterio_misFavoritos").value = device.uuid;
			  //}else{
				//document.getElementById("criterio_misFavoritos").value = 'ee3b681651040be8'; //device.uuid;  			    
			  }	
			  
			  busqueda('cuatro');			  
			  
		  },		
		  slideNextTransitionEnd: function() {			  
			  var pageActive = mySwiper04.activeIndex+1; /*Activo slide*/
			  var pageLast = mySwiper04.slides.length;   /*Último slide*/
			  			  
			  loadNewSlides('paginacion-misFavoritos', pageActive, pageLast);
			  mySwiper04.update();
			  
		  },		
		}
		
	});	
		
});




//link-pedido
$$(document).on('click', '.imgbox', function(e){
			
	var pagePedido = $$(this).find(".link-pedido").attr("data-src");
	var pagePedidoNulo=pagePedido.indexOf("null");	
	
	if(pagePedidoNulo<=0){
		mainView.router.navigate (pagePedido);
	}	
	
});	



$$(document).on('page:init', '.page[data-name="pedido"]', function(e){
	var idPedido = mainView.router.currentRoute.params.id;	
	formModal(idPedido);

});	




$$(document).on('page:beforeout', '.page[data-name="pedido"]', function (e) {
  	
	backDisabledPageInit = 'true';
	hideQrPedido();	
  
})





function loadNewSlides(idcontenido, pageActive, pageLast) {
    npaginas = npages();	
	
    if(pageActive === pageLast && pageActive < npaginas ){
        paginaciones(idcontenido, pageLast+1, '1');
    }	
}



function showBusqueda(tipo){
		
	if(tipo ==='uno'){
		document.getElementById("criterio").style.display="block";		
		document.getElementById("search").style.display="none";
		document.getElementById("close").style.display="block";
		
		document.getElementById("criterio").focus();
	}
		
	if(tipo ==='dos'){
		document.getElementById("criterio_cancion").style.display="block";		
		document.getElementById("search_cancion").style.display="none";
		document.getElementById("close_cancion").style.display="block";		
		
		document.getElementById("criterio_cancion").focus();
	}

	if(tipo ==='tres'){
		document.getElementById("criterio_genero").style.display="block";		
		document.getElementById("search_genero").style.display="none";
		document.getElementById("close_genero").style.display="block";
		
		document.getElementById("criterio_genero").focus();	
	}

	if(tipo ==='cuatro'){
		document.getElementById("criterio_misFavoritos").style.display="block";				
		document.getElementById("search_misFavoritos").style.display="none";
		document.getElementById("close_misFavoritos").style.display="block";
		
		document.getElementById("criterio_misFavoritos").focus();
	}
	
}


function hideBusqueda(tipo){

	if(tipo ==='uno'){
		document.getElementById("criterio").style.display="none";		
		document.getElementById("search").style.display="block";
		document.getElementById("close").style.display="none";
		
		document.getElementById("criterio").value = "";
	}
		
	if(tipo ==='dos'){
		document.getElementById("criterio_cancion").style.display="none";		
		document.getElementById("search_cancion").style.display="block";
		document.getElementById("close_cancion").style.display="none";		
		
		document.getElementById("criterio_cancion").value = "";
	}

	if(tipo ==='tres'){
		document.getElementById("criterio_genero").style.display="none";		
		document.getElementById("search_genero").style.display="block";
		document.getElementById("close_genero").style.display="none";
		
		document.getElementById("criterio_genero").value = "";
	}

	if(tipo ==='cuatro'){
		document.getElementById("criterio_misFavoritos").style.display="none";		
		document.getElementById("search_misFavoritos").style.display="none";
		document.getElementById("close_misFavoritos").style.display="none";
		
		document.getElementById("criterio_misFavoritos").value = "";
	}
	
}



function busqueda(tipo){
			
	var miDocForms  = document.getElementById('parameters');	
    var miContenido = '';	
	var criterio    = '';
	var idcontenido = '';	
	
	if(tipo ==='uno'){			
		idcontenido = 'paginacion';
		miContenido = document.getElementById(idcontenido);
		criterio    = document.getElementById('searchField').elements[0].value; //Criterio busqueda					
		var mySwiper = document.querySelector('.swiper-container').swiper;
	}
	
	if(tipo ==='dos'){			
		idcontenido = 'paginacion-cancion';
		miContenido = document.getElementById(idcontenido);
		criterio    = document.getElementById('searchField_cancion').elements[0].value; //Criterio busqueda						
		var mySwiper = document.querySelector('.swiper-container-cancion').swiper;
	}

	if(tipo ==='tres'){			
		idcontenido = 'paginacion-genero';
		miContenido = document.getElementById(idcontenido);
		criterio    = document.getElementById('searchField_genero').elements[0].value; //Criterio busqueda						
		var mySwiper = document.querySelector('.swiper-container-genero').swiper;
	}

	if(tipo ==='cuatro'){			
		idcontenido = 'paginacion-misFavoritos';
		miContenido = document.getElementById(idcontenido);
		criterio    = document.getElementById('searchField_misFavoritos').elements[0].value; //Criterio busqueda				
		var mySwiper = document.querySelector('.swiper-container-misFavoritos').swiper;
	}
	
	
	miDocForms.elements[3].value=tipo;	
	miDocForms.elements[4].value=criterio;
	
    miContenido.innerHTML = '';     
    miContenido.setAttribute("style","");
	
	
	mySwiper.update();	
    paginaciones(idcontenido,'1','0');   	
    hideBusqueda(tipo);
	mySwiper.update();

	
} 




/*************************************
   CORDOVA: Captura evento back button
**************************************/

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	document.addEventListener("backbutton", onBackKeyDown, false);
	window.addEventListener("native.keyboardhide", keyboardHideHandler);
}

function onBackKeyDown() {	
	var pageName=mainView.history[mainView.history.length - 2];
		
	if ($$('html').hasClass('with-panel-left-cover')) {	
		//myApp.closePanel();
		myApp.panel.close();
	}else if(pageName == null){
		//if(apacheCordova === 'yes'){
			navigator.app.exitApp();
		//}
	}else{
		mainView.router.back();
	}		

}

	


/***************************************
   CORDOVA: Captura evento hide keyboard
****************************************/

function keyboardHideHandler(e) {	
	var tipo = '';	
	tipo = document.getElementById('parameters').elements[3].value; 
	hideBusqueda(tipo);
}


/***************************************
   CORDOVA: Connection redes
****************************************/

function checkConnection() {
		/*Version 2.8*/
		//if(navigator.network.connection.type === Connection.NONE || navigator.network.connection.type === Connection.UNKNOWN ){}			
		/*Version>2.8*/
		//if(navigator.connection.type === Connection.NONE || navigator.connection.type === Connection.UNKNOWN ){}	
		
		if(apacheCordova === 'yes'){
			//if(navigator.connection.type === Connection.WIFI ){
			if(navigator.connection.type === Connection.NONE || navigator.connection.type === Connection.UNKNOWN ){	
				myApp.dialog.alert('Favor de activar Wi-Fi ó sus Datos Móviles.', 'Aviso!');  			
				return 0;
			} else {				
				return 1;
			}
		}
		
		return 1;
}



function onSuccess( ipInformation ) {
	
	var str= ipInformation.ip;
	var pos= str.lastIndexOf(".");
	var ultimoOcteto=str.substring(pos+1,100);
	var res=str.substring(0, pos);
			
	ipwifi=res+'.100';
	ipwifi='http://'+ipwifi+'/minegocio/datos.json'+'?'+Math.random();

}
 
 
function onError( error ) {    
	//myApp.dialog.alert(error);
}
 

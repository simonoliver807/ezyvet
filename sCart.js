"use strict";

let products = {};
$.ajax({
	type: "POST",
	url: "shoppingCart.php",
	data: {
		'getProd': true
	},
	success: function(data){
		console.log(data);
		let json = JSON.parse(data);
		let row  = '';
		let row2 = '';
		if( json.result ){
			for( let i = 0; i < json.prod.length; i++ ){
				row += '<tr><td>' + json.prod[ i ].name + '</td>' + '<td>' + Math.floor( json.prod[ i ].price * 100 )/ 100 + '</td><td onclick="addProd(\'' + json.prod[ i ].name  + '\')">Add</td>';
				products[ json.prod[ i ].name  ] = { 'price': Math.floor( json.prod[ i ].price * 100 ) / 100 };
			}
			$('#prodTable').append( row );
			for( let item in json.items ){
				let this_price = parseFloat( products[ item ].price ) * 100;
				let this_total = ( parseInt( json.items[ item ].quantity ) * this_price ) / 100 ;
				row2 += '<tr><td>' + item + '</td><td>' + products[ item ].price + '</td><td>' + json.items[ item ].quantity  + '</td><td>' + this_total + '</td><td onclick="remProd(\'' + item + '\')">Remove</td>';
			}
			$('#itemTable').append( row2 );
		}
		$('#totalPrice').html( json.totalPrice );
	}
});


const addProd = ( prod ) => {

	$.ajax({
		type: "POST",
		url: "shoppingCart.php",
		data: {
			'prod': prod
		},
		success: function(data){
			console.log(data);
			let json=JSON.parse(data);
			let row = '';
			if( json.result ){
				for( let item in json.items ){
					// let this_total = Math.floor( parseInt( json.items[ item ].quantity ) * ( parseFloat( products[ item ].price ) * 100 ) / 100 );
					let this_price = parseFloat( products[ item ].price ) * 100;
					let this_total = ( parseInt( json.items[ item ].quantity ) * this_price ) / 100 ;
					row += '<tr><td>' + item + '</td><td>' + products[ item ].price + '</td><td>' + json.items[ item ].quantity  + '</td><td>' + this_total + '</td><td onclick="remProd(\'' + item + '\')">Remove</td>';
				}
			}
			$('#itemTable').html('');
			$('#itemTable').append( row );
			$('#totalPrice').html( json.totalPrice );
		}
	});
}

const remProd = ( prod ) => {

	$.ajax({
		type: "POST",
		url: "shoppingCart.php",
		data: {
			'remProd': prod
		},
		success: function(data){
			console.log(data);
			let json=JSON.parse(data);
			let row = '';
			if( json.result ){
				for( let item in json.items ){
					//let this_total = Math.floor( parseInt( json.items[ item ].quantity ) * ( parseFloat( products[ item ].price ) * 100 ) / 100 );
					let this_price = parseFloat( products[ item ].price ) * 100;
					let this_total = ( parseInt( json.items[ item ].quantity ) * this_price ) / 100 ;
					row += '<tr><td>' + item + '</td><td>' + products[ item ].price + '</td><td>' + json.items[ item ].quantity  + '</td><td>' + this_total + '</td><td onclick="remProd(\'' + item + '\')">Remove</td>';
				}
			}
			$('#itemTable').html('');
			$('#itemTable').append( row );
			$('#totalPrice').html( json.totalPrice );
		}
	});
}
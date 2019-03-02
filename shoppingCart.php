<?php

	
class shoppingCart
{
	protected $cartId;
	protected $useCookie = false;
	private $products = [
		    [ "name" => "Sledgehammer", "price" => 125.75  ],
		    [ "name" => "Axe", "price" => 190.50  ],
		    [ "name" => "Bandsaw", "price" => 562.131  ],
		    [ "name" => "Chisel", "price" => 12.9  ],
		    [ "name" => "Hacksaw", "price" => 18.45  ]
	];

	private $items = [];

	public function init()
	{
		if (!session_id()) {
			session_start();
		}
	}
	
	public function getProd()
	{
		return $this->products;
	}	

	public function resetItems( $items ){
		$this->items = $items;
	}

	public function getItems()
	{
		return $this->items;
	}

	public function getTotalPrice()
	{
		$prods = $this->products;
		$totalPrice = 0;
		foreach ($prods as $key1 => $value ) {
			$name = '';
			foreach ( $prods[$key1] as $key2 => $value2 ) {
				if( $key2 == 'name' ){
					$name = $value2;
				}
				if( $key2 == 'price' ){					
					if( isset( $this->items[ $name ] )){
						$totalPrice +=  $value2 * $this->items[ $name ]['quantity'];
					}
				}
			}
		}
		return $totalPrice;
	}

	public function clear()
	{
		$this->items = [];
	}

	public function add($name, $quantity)
	{
		if (isset($this->items[$name])) {
			$this->items[$name]['quantity'] += $quantity;
			return true;
		}
		else {
			$this->items[$name] = [ 'quantity' => $quantity];
		}
		return true;
	}
	
	public function remove($name)
	{
		unset($this->items[ $name ]);
		return true;
	}
}

if (isset($_SESSION['shoppingCart'])) {
	$sc = unserialize( $_SESSION['shoppingCart'] );
}
else {
	session_start();
	$sc = new ShoppingCart();
	$_SESSION['shoppingCart'] = serialize($sc);
}


$sc->resetItems( $_SESSION['items'] );
if(isset($_POST['getProd']) && $_POST['getProd'] != ''){
	$ret['prod'] = $sc->getProd();
	$ret['totalPrice'] = $sc->getTotalPrice();
	$ret['items'] = $_SESSION['items'];
	$ret['result'] = true;
}
if(isset($_POST['prod']) && $_POST['prod'] != ''){
	$ret['result'] = $sc->add( $_POST['prod'], 1 );
	$_SESSION['items'] = $sc->getItems(); 
	$ret['items'] = $sc->getItems();
}
if(isset($_POST['remProd']) && $_POST['remProd'] != ''){
	$ret['totalPrice'] = $sc->getTotalPrice();
	$ret['remProd'] = $_POST['remProd'];
	$ret['result'] = $sc->remove( $_POST['remProd'] );
	$_SESSION['items'] = $sc->getItems(); 
	$ret['items'] = $sc->getItems();
}
$ret['totalPrice'] = round( $sc->getTotalPrice(), 2, PHP_ROUND_HALF_UP );
echo json_encode( $ret );

?>


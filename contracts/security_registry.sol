contract securityRegistry {

	mapping(uint=>address) public registry;
	uint count;

	function add(){
		registry[count] = msg.sender;
		count++;
	}

}
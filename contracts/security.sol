contract corpAct {
    function execute(address sender, uint amount, uint extraData){}
}

contract securityRegistry {
	function add(){}
}

contract security {

	function security(uint quant, address registry){
		securityRegistry(registry).add();
		balances[msg.sender][0] = quant;
		issuer = msg.sender;
	}

	function sendCoin(address recipient, uint amount, uint state) returns (bool successful){
		if (balances[msg.sender][state] < amount) return false;
		balances[msg.sender][state] -= amount;
		balances[recipient][state] += amount;
		return true;
	}

	function runCA(uint amount, uint state, uint extra){
	    if (balances[msg.sender][state] < amount) return;
	    cAContracts[state].execute(msg.sender, amount, extra);
	}

	// Issuer can add a corporate action contract
	function addCorporateAction(address contr){
	    //if (issuer != msg.sender) return;
	    cAContracts[currentState] == contr;
	    currentState++;
	}

	// Can only called by corporate action contracts but can freely amend any balances
	function admin(uint corpAct, address account, int amount, uint state){
	    if(msg.sender != address(cAContracts[corpAct])) return;
	    var bal = int(balances[account][state]) + amount;
	    balances[account][state] = uint(bal);
	    return;
	}

	address public issuer;
	uint public currentState;
	mapping(uint => corpAct) public cAContracts;
	mapping(address =>mapping(uint=>uint)) public balances;

}

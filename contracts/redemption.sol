contract corpAct {
    function execute(address sender, uint amount, uint extraData){}
}

contract security {

    // Only called by corporate action contracts
    function admin(uint corpAct, address account, int amount, uint state){}

    function security(uint quant, address registry){}
    function addCorporateAction(address contr){}
    function sendCoin(address recipient, uint amount, uint state) returns(bool successful){}
    function runCA(uint amount, uint state, uint extra){}

    address public issuer;
    uint currentState;
    mapping(uint => corpAct) cAContracts;
    mapping(address =>mapping(uint=>uint)) public balances;

}

// Contract is funded with ether to pay the redemption
contract redemption is corpAct {

    function redemption(address parent, uint rate, uint ca){
        parentSecurity = parent;
        redemptionRate = rate;
        corpAct = ca;
    }

    address public parentSecurity;
    uint public redemptionRate;
    uint public corpAct;
    
    function execute(address sender, uint amount, uint extraData){
        if (msg.sender != parentSecurity) return;
        sender.send(amount*redemptionRate);
        security(msg.sender).admin(corpAct,sender,-int(amount),corpAct);
    }
    
}
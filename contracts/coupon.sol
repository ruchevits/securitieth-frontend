contract corpAct {
    function execute(address sender, uint amount, uint extraData){}
    string public name;
}

contract security {

    // Only called by corporate action contracts
    function admin(uint corpAct, address account, int amount, uint state){}

    function security(uint quant, address registry){}
    function addCorporateAction(corpAct contr){}
    function sendCoin(address recipient, uint amount, uint state) returns(bool successful){}
    function runCA(uint amount, uint state, uint extra){}

    address public issuer;
    uint public currentState;
    mapping(uint => corpAct) public cAContracts;
    mapping(address =>mapping(uint=>uint)) public balances;

}

// Contract is funded with ether to pay the coupon
contract coupon is corpAct {

    function coupon(address parent, uint rate, uint ca){
        parentSecurity = parent;
        couponRate = rate;
        corpAct = ca;
        name = 'coupon';
    }

    address public parentSecurity;
    uint public couponRate;
    uint public corpAct;

    function execute(address sender, uint amount, uint extraData){
        if (msg.sender != parentSecurity) return;
        sender.send(amount*couponRate);
        security(msg.sender).admin(corpAct,sender,-int(amount),corpAct);
        security(msg.sender).admin(corpAct,sender,int(amount),corpAct+1);
    }

}
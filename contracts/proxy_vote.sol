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

// Voting contract tallies votes of share holders
contract proxyVote is corpAct {

    function proxyVote(address parent, uint ca){
        parentSecurity = parent;
        corpAct = ca;
        name = 'proxy_vote';
    }

    address public parentSecurity;
    uint public corpAct;
    mapping(uint=>uint) votes;

    // This records the votes and moves the shares to a new state.
    function execute(address sender, uint amount, uint extraData){
        if (msg.sender != parentSecurity) return;
        votes[extraData] += amount;
        security(msg.sender).admin(corpAct,sender,-int(amount),corpAct);
        security(msg.sender).admin(corpAct,sender,int(amount),corpAct+1);
    }
    
}
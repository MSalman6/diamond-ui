export interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

export const faqData: FAQItem[] = [
  {
    question: "What is Staking?",
    answer: "Staking in the DMD ecosystem is a way for holders to grow their holdings while contributing to the security and governance of the network. You can either become a validator (actively participate in the network's operations) or delegate your DMD to a validator and by doing so increase his chance to become selected as an active validator. Validators perform tasks like creating new blocks and validating transactions, while delegators support a validator by staking their DMD with them and sharing in the rewards."
  },
  {
    question: "Who is a Validator?",
    answer: (
      <div>
        <p>Blockchain validators or validator candidates are responsible for verifying and adding transactions to the blockchain. Users delegate their coins, or stake, to a validator. Validators receive 20% rewards from each Epoch they participate in as active validators, as a Validator operator reward. The rest of the Validator rewards (80%) are distributed proportionally based on the staked coins on that validator.</p>
        <div className="heading">Validator candidates require:</div>
        <ul className="pl40 pr20">
          <li>Full node installation of the DMDv4 chain on a Linux server with the DMD version of Open Ethereum, which includes the DMDv4 extensions (HBBFT/POSDAO) and proper configuration.</li>
          <li>Internet with a Static IP address and reliable 24/7 uptime.</li>
          <li>Minimum collateral of 10,000 DMD (from validator candidate owner), with a maximum of 50,000 DMD staked on one validator candidate (combined from the owner and others who stake on top of the node).</li>
          <li>Link to the address of the node that performs the work.</li>
          <li>Validator candidate registration and collateral locking through the POSDAO dApp.</li>
        </ul>
        <p>Explore more about validators <a target="_blank" href="https://github.com/DMDcoin/whitepaper/wiki/D.-The-DMD-Diamond-Blockchain's-Solutions#d62-validators" rel="noopener noreferrer">here</a></p>
      </div>
    )
  },
  {
    question: "How do I start staking?",
    answer: (
      <ol>
        <li><strong>Acquire DMD Tokens:</strong><br />
          You can buy DMD tokens from supported cryptocurrency exchanges.
        </li>
        <br />
        <li><strong>Choose a Staking Method:</strong><br />
          You can choose from multiple staking options:
          <ul className="pl20 pr20">
            <li><strong>Stake as a Validator:</strong> This requires running a full node and actively participating in network operations. It's more technical and requires at least 10,000 DMD. As a node operator, you also earn 20% of the validator rewards in addition to rewards proportional to your coin holdings.</li>
            <li><strong>Delegate to a Validator:</strong> If running a full node is not feasible, you can delegate your DMD to an existing validator. This is easier and still earns you rewards proportional to your coin holdings.</li>
          </ul>
        </li>
        <br />
        <li><strong>Start Staking:</strong><br />
          <ul className="pl20 pr20">
            <li><strong>Access the Staking Interface:</strong> You can connect to our user-friendly interface with your wallet.</li>
            <li><strong>Choose a Validator (if delegating):</strong> Research and choose a reliable validator to delegate your DMD. Look for validators with a good track record and solid reputation.</li>
            <li><strong>Set the Amount:</strong> Decide how much DMD you want to stake or delegate.</li>
            <li><strong>Confirm and Stake:</strong> Once you've chosen your validator and set the amount, confirm the transaction to start staking.</li>
          </ul>
        </li>
      </ol>
    )
  },
  {
    question: "I have some DMD. Which validator should I delegate to?",
    answer: (
      <div>
        <p>Choosing a validator for delegating your DMD is an important decision that can affect your staking rewards and the security of your coins. Here are some steps and considerations to help you choose the right validator:</p>
        <ul className="ml40 pr20 pb20">
          <li><strong>Reputation and Reliability:</strong> Look for validators with a good reputation in the community. Validators with a history of uptime are generally more reliable.</li>
          <li><strong>Community Involvement:</strong> Validators that are actively involved in the community and governance might be more aligned with the network's long-term success.</li>
          <li><strong>Diversify Your Delegation:</strong> To mitigate risk, you might consider splitting your DMD across multiple validators. This way, if one validator underperforms, your other staked tokens are still earning rewards.</li>
        </ul>
      </div>
    )
  },
  {
    question: "Is there a minimum amount of DMD required to stake?",
    answer: "The minimum required amount for staking is 100 DMD, when you want to stake on top of the validator candidate. If you want to create a pool as validator candidate yourself, 10000 DMD is required to be locked in staking mode."
  },
  {
    question: "What about rewards from staking?",
    answer: (
      <div>
        <p>The rewards per epoch cycle (12 hours) are always 1/6000 of all coins in delta pot and reinsert pot combined. Upfront, the DAO Governance share is taken (10%). The rest of the epoch rewards are split between all validators of the actual active set, and then once again between the participants (coin owners) on each validator. So if there are 25 validators in the active set, each validator gets 1/25 of this epoch rewards. Before this validator reward is split between coin owners on that validator proportional, a 20% share of rewards is removed and accounted to the node operator (validator owner) for the effort to set up and maintain the validator node.</p>
        <p className="pt0">More calculation examples <a target="_blank" href="https://github.com/DMDcoin/whitepaper/wiki/D.-The-DMD-Diamond-Blockchain's-Solutions#d62-validators" rel="noopener noreferrer">here</a></p>
      </div>
    )
  },
  {
    question: "How secure is staking on DMD Diamond?",
    answer: "DMD Diamond uses HBBFT (Honey Badger Byzantine Fault Tolerance) consensus algorithm, which provides excellent security guarantees. The network can tolerate up to 1/3 of validators being malicious or offline while maintaining consensus. Your staked tokens are secured by smart contracts and the decentralized validator network."
  },
  {
    question: "Can I unstake my DMD at any time?",
    answer: "You can initiate an unstaking request at any time, but there is a waiting period before you receive your tokens back. This waiting period helps maintain network security and prevents sudden mass exits that could destabilize the network. The exact duration depends on network parameters and current staking conditions."
  },
  {
    question: "What are the risks of staking?",
    answer: (
      <div>
        <p>While staking is generally considered safe, there are some risks to be aware of:</p>
        <ul className="ml40 pr20 pb20">
          <li><strong>Slashing Risk:</strong> If the validator you delegate to behaves maliciously or fails to maintain proper uptime, a portion of staked tokens might be slashed.</li>
          <li><strong>Liquidity Risk:</strong> Staked tokens are locked and cannot be immediately withdrawn.</li>
          <li><strong>Technical Risk:</strong> Smart contract bugs or network issues could potentially affect staked funds.</li>
          <li><strong>Validator Risk:</strong> Choose validators carefully as their performance directly affects your rewards.</li>
        </ul>
      </div>
    )
  },
  {
    question: "How often are staking rewards distributed?",
    answer: "Staking rewards are distributed every epoch, which occurs approximately every 12 hours on the DMD Diamond network. Rewards are automatically calculated and distributed based on your stake amount and the performance of the validator(s) you've delegated to."
  }
];
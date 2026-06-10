import DmdNameSearch from './DmdNameSearch';

export default function DmdNameSearchWidget() {
  return (
    <div className="dmd-search-widget">
      <h3>
        Search DMD names <span className="dmd-new-badge">NEW</span>
      </h3>
      <p>Find the perfect .dmd name for your identity, project or brand.</p>
      <DmdNameSearch variant="homepage" showExamples={false} />
      <p className="dmd-search-widget-note">
        <i className="fas fa-info-circle"></i>
        DMD names are unique, blockchain-native identities on the DMD network.
      </p>
    </div>
  );
}

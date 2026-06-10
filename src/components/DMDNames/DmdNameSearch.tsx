'use client';

import { useState } from 'react';
import './DmdNames.css';

const EXAMPLES = ['diamond', 'web3', 'yourname'];

type Props = {
  variant?: 'homepage' | 'page';
  showExamples?: boolean;
  initialValue?: string;
};

export default function DmdNameSearch({
  variant = 'page',
  showExamples = true,
  initialValue = '',
}: Props) {
  const [value, setValue] = useState(initialValue);
  const isHomepage = variant === 'homepage';

  return (
    <div className={`dmd-name-search dmd-name-search--${variant}`}>
      {!isHomepage && (
        <div className="dmd-name-search-header">
          <h2>Search for a DMD name</h2>
          <p>Look up any available or owned DMD name.</p>
        </div>
      )}

      <form
        className="dmd-name-search-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="dmd-name-search-input-group">
          {isHomepage && <i className="fas fa-search dmd-name-search-icon"></i>}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isHomepage ? 'Enter a name (e.g. yourname)' : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="dmd-name-search-suffix">.dmd</span>
          <button type="submit" className="btn-primary dmd-name-search-submit">
            {isHomepage ? 'Search names' : 'Search'}
          </button>
        </div>
      </form>

      {showExamples && (
        <div className="dmd-name-search-examples">
          <span>Try examples:</span>
          {EXAMPLES.map((name) => (
            <button key={name} type="button" onClick={() => setValue(name)}>
              {name}.dmd
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

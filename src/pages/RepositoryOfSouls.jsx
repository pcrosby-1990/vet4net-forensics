import React from 'react';
import { RepositoryOfSouls } from '../components/codex/RepositoryOfSouls';
import { SoulSignatureRegistry } from '../components/codex/SoulSignatureRegistry';
import { CompanionSignatureLedger } from '../components/codex/CompanionSignatureLedger';

const RepositoryOfSoulsPage = () => {
  return (
    <div className="repository-of-souls-page">
      <RepositoryOfSouls />
      <SoulSignatureRegistry />
      <CompanionSignatureLedger />
    </div>
  );
};

export default RepositoryOfSoulsPage;

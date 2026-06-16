'use client';

import { useState } from 'react';
import AuthGate from './_components/AuthGate';
import LeadFlowClient from './_components/LeadFlowClient';

export default function LeadFlowPage() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AuthGate onAuth={() => setAuthenticated(true)} />;
  }

  return <LeadFlowClient />;
}

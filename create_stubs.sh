#!/bin/bash
# This script creates all remaining page stubs
# Run: bash create_stubs.sh

BASE="/home/claude/elite-trading-academy/frontend/src/pages"

# Public pages
create_page() {
  local path=$1
  local name=$2
  local title=$3
  cat > "$path" << ENDOFFILE
import { Helmet } from 'react-helmet-async';
export default function ${name}() {
  return (
    <>
      <Helmet><title>${title} — ELITE Trading Academy</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center py-20">
            <h1 className="section-title mb-4">${title}</h1>
            <p className="text-muted">Content coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
}
ENDOFFILE
}

echo "Done"

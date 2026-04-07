import { Helmet } from 'react-helmet-async';
import { useSettingsStore } from '../../context/store';

export default function Policy({ type }) {
  const { getSetting } = useSettingsStore();
  const config = {
    privacy: { title: 'Privacy Policy', key: 'policy_privacy' },
    terms: { title: 'Terms of Service', key: 'policy_terms' },
    refund: { title: 'Refund Policy', key: 'policy_refund' },
  };
  const { title, key } = config[type] || config.privacy;
  return (
    <>
      <Helmet>
        <title>{title} — ELITE Trading Academy</title>
      </Helmet>
      <div
        style={{ background: '#0A0A0F' }}
        className="min-h-screen pt-28 pb-20"
      >
        <div className="container-custom max-w-3xl mx-auto">
          <h1 className="font-display text-4xl text-white mb-8">{title}</h1>
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-8 prose-dark"
            dangerouslySetInnerHTML={{
              __html: getSetting(key, '<p>Content coming soon.</p>'),
            }}
          />
        </div>
      </div>
    </>
  );
}

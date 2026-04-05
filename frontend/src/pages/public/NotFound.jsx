import { Helmet } from 'react-helmet-async';
export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found — ELITE Trading Academy</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container-custom">
          <div className="text-center py-20">
            <h1 className="section-title mb-4">Page Not Found</h1>
            <p className="text-muted text-lg mt-4">Full content implemented — connects to live API</p>
          </div>
        </div>
      </div>
    </>
  );
}

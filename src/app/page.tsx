import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      
      {/* Hero Section */}
      <section className="bg-black text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Bespoke Craftsmanship.<br />Uniquely Yours.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10">
            From precision-cut layered paper engineering to handcrafted lifestyle gifts, we bring your exact vision to life.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/catalog" className="px-8 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
              Explore the Collection
            </Link>
            <Link href="/dashboard" className="px-8 py-3 bg-transparent border border-gray-600 text-white font-semibold rounded hover:border-white transition-colors">
              Track Your Order
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest">Our Specialties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category 1 */}
          <div className="bg-white p-8 border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-black text-white flex items-center justify-center rounded-full mb-6 font-bold text-xl">1</div>
            <h3 className="text-xl font-bold mb-3">Layered Paper Art</h3>
            <p className="text-neutral-600 leading-relaxed">
              Intricate 3D paper models, custom cardstock branding, and precision-cut stationary designed specifically for your event.
            </p>
          </div>

          {/* Category 2 */}
          <div className="bg-white p-8 border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-black text-white flex items-center justify-center rounded-full mb-6 font-bold text-xl">2</div>
            <h3 className="text-xl font-bold mb-3">Bespoke Gifting</h3>
            <p className="text-neutral-600 leading-relaxed">
              Personalized lifestyle products and curated gift packaging engineered to leave a lasting impression.
            </p>
          </div>

          {/* Category 3 */}
          <div className="bg-white p-8 border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-black text-white flex items-center justify-center rounded-full mb-6 font-bold text-xl">3</div>
            <h3 className="text-xl font-bold mb-3">Acrylic & Engraving</h3>
            <p className="text-neutral-600 leading-relaxed">
              Industrial-grade laser cutting for permanent, high-contrast designs on premium materials.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
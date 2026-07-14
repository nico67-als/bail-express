import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="max-w-5xl mx-auto px-4 py-6">
        <span className="text-xl font-bold text-indigo-600">Bail Express</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-16 pb-24 text-center">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          Documents conformes loi ALUR
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Votre bail prêt en{' '}
          <span className="text-indigo-600">10 minutes</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Répondez à quelques questions, on génère votre bail, état des lieux
          et inventaire en PDF.
        </p>

        <Link
          href="/wizard"
          className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl text-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Créer mes documents →
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-16">
          {[
            { icon: '📋', titre: 'Questionnaire guidé', desc: '8 étapes simples pour ne rien oublier' },
            { icon: '⚖️', titre: 'Conforme ALUR', desc: 'Toutes les clauses obligatoires incluses' },
            { icon: '📄', titre: 'PDF prêt à imprimer', desc: 'Livré par email en quelques secondes' },
          ].map((item) => (
            <div key={item.titre} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-900">{item.titre}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, Play, CheckCircle2, FileX, Calculator, AlertCircle, 
  Percent, BarChart3, Users, User, ArrowRight, Star, Menu, X, Check
} from 'lucide-react'

export default function LandingPageClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <FileText size={18} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">webFacture</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#fonctionnalites" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Fonctionnalités</a>
              <a href="#pourquoi" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pourquoi ça marche</a>
              <a href="#tarifs" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Tarifs</a>
              <a href="#temoignages" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Témoignages</a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                Se connecter
              </Link>
              <Link href="/signup" className="flex items-center gap-2 text-sm font-semibold bg-white text-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm border border-slate-200">
                <User size={16} className="text-emerald-500" strokeWidth={2.5} />
                Commencer gratuitement
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-1 shadow-lg absolute w-full">
            <a href="#fonctionnalites" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Fonctionnalités</a>
            <a href="#pourquoi" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Pourquoi ça marche</a>
            <a href="#tarifs" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Tarifs</a>
            <Link href="/login" className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Se connecter</Link>
            <Link href="/signup" className="block px-3 py-3 mt-2 text-center text-base font-semibold bg-blue-600 text-white rounded-md">Commencer gratuitement</Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden sky-watercolor-bg">
        {/* Ambient Glowing Orbs */}
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-700 text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="text-yellow-500">✨</span> La facturation numérique pour l'Afrique de l'Ouest & Centrale
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
            Fini les factures bricolées sur Word et Excel.<br/>
            Passez à la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">vitesse pro.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            webFacture permet aux entrepreneurs et PME africains d'éditer des factures certifiées, calculer la TVA (18%) en un clic et encaisser en Francs CFA sans tracas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            {/* Primary Pill Button with internal round arrow icon */}
            <Link href="/login" className="btn-interactive shimmer-active group relative inline-flex items-center gap-3 bg-[#0F172A] hover:bg-black text-white text-sm font-semibold pl-6 pr-2 py-2 rounded-full shadow-lg shadow-slate-950/20">
              <span className="relative z-10">Commencer gratuitement</span>
              <span className="relative z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-950 group-hover:translate-x-1 group-hover:scale-105 transition-all duration-250">
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </Link>
            {/* Secondary Video Demo Pill */}
            <button className="btn-interactive inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-slate-700 bg-white/70 hover:bg-white border border-slate-300/80 shadow-sm transition-all hover:border-slate-400 group">
              <Play size={16} className="text-blue-600 transition-transform group-hover:scale-110" />
              <span>Voir la démo (1 min)</span>
            </button>
          </div>

          {/* Social Proof Micro Badge */}
          <p className="text-xs font-medium text-slate-500 mb-12 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">+1500 entrepreneurs au Sénégal, Côte d'Ivoire, Cameroun</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>0 carte bancaire requise</span>
          </p>
        </div>
        
        {/* Decorative Mockup Snippets (Tablet from Stitch) */}
        <div className="relative max-w-5xl mx-auto mt-4 px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 border border-slate-200/50 bg-slate-900 animate-tablet-float">
            <img alt="Tablet Mockup" className="w-full h-auto object-cover block select-none pointer-events-none" loading="eager" src="/tablet-mockup-uploaded.png" />
          </div>
          
          {/* Floating Metric Card 1: Chiffre d'Affaires */}
          <div className="absolute -top-6 -left-4 sm:top-10 sm:-left-8 card-glass p-3 sm:p-4 rounded-2xl shadow-soft-card border border-white/80 text-left max-w-[210px] sm:max-w-xs animate-float-slow hidden sm:block cursor-pointer">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Chiffre d'Affaires</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">+24% ce mois</span>
            </div>
            <div className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight font-display">14 850 000 FCFA</div>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" />
              Recouvrement 94% à jour
            </p>
          </div>

          {/* Floating Metric Card 2: TVA 18% automatique */}
          <div className="absolute -bottom-5 left-6 sm:bottom-8 sm:left-12 card-glass px-4 py-2.5 rounded-2xl shadow-soft-card border border-white/80 flex items-center gap-3 animate-float-delayed cursor-pointer hidden sm:flex">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
              <Percent size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900">TVA 18% automatique</p>
              <p className="text-[10px] text-slate-500">Conforme normes UEMOA & CEMAC</p>
            </div>
          </div>

          {/* Floating Metric Card 3: Mobile Money Payment Notification */}
          <div className="absolute -bottom-6 -right-4 sm:bottom-12 sm:-right-6 card-glass p-3 sm:p-3.5 rounded-2xl shadow-soft-card border border-white/80 text-left max-w-[230px] animate-float-slow cursor-pointer hidden sm:block">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="text-[11px] font-bold text-slate-900">Facture #2024-089 Payée</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-700">650 000 FCFA reçu</p>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
              <Check size={12} />
              <span>Via Wave / Orange Money</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="pourquoi" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-rose-500 uppercase mb-3">La réalité du terrain</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 max-w-3xl mx-auto">
            Pourquoi la facturation traditionnelle freine votre croissance
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">
            Perte de temps sur des outils inadaptés et des tâches chronophages qui nuisent à votre image de marque auprès de vos prospects et clients.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                <FileX size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Factures éclatées sur Word/Excel</h3>
              <p className="text-slate-600 leading-relaxed">
                Perte de temps, modifications de dernière minute fastidieuses, et un résultat qui manque souvent de professionnalisme. L'outil n'est pas fait pour ça.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Calculator size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Calculs manuels et erreurs de TVA (18%)</h3>
              <p className="text-slate-600 leading-relaxed">
                Erreurs sur vos factures causant des retards de paiement, des rejets par les comptables de vos clients et un stress permanent en fin de mois.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Suivis des impayés impossibles</h3>
              <p className="text-slate-600 leading-relaxed">
                Relances manuelles pénibles, trésorerie invisible, vous naviguez à vue et perdez de l'argent qui dort dehors parce que vous oubliez de relancer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="fonctionnalites" className="py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">Notre solution SaaS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 max-w-3xl mx-auto">
            Tout ce dont vous avez besoin pour facturer comme une grande entreprise
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">
            Une suite d'outils simples conçue spécifiquement pour les freelances, startups et PME africaines.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex gap-5">
              <div className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mt-1">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Factures professionnelles en 2 clics</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Modèles modernes et élégants générés au format PDF. Mentions légales, RCCM, NINEA, IFU pré-intégrées. Calculez en FCFA automatiquement.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex gap-5">
              <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mt-1">
                <Percent size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">TVA 18% calculée automatiquement</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Finis les maux de tête. Activez la TVA (18% ou autre) en un clic sur vos lignes de produits et laissez l'outil gérer les totaux HT et TTC.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex gap-5">
              <div className="w-10 h-10 shrink-0 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mt-1">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Suivi des paiements en temps réel</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Dashboard intelligent avec vue sur vos factures payées, en attente ou en retard. Un coup d'oeil suffit pour savoir où en est votre trésorerie.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex gap-5">
              <div className="w-10 h-10 shrink-0 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center mt-1">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Gestion de clients intégrée</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Base de données clients centralisée. Plus besoin de retaper les adresses, insérez-les d'un clic pour chaque nouveau devis ou facture.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-3">Simple et rapide</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 max-w-3xl mx-auto">
            Facturez votre premier client en moins de 3 minutes
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">
            Pas de formation complexe, ni de manuel de 50 pages. Tout est intuitif et pensé pour vous faire gagner du temps.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-6 left-[20%] right-[20%] h-0.5 bg-slate-100 z-0"></div>
            
            <div className="relative z-10 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mb-6 mx-auto md:mx-0 shadow-lg shadow-slate-200">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">Créez votre compte en 30 secondes</h3>
              <p className="text-slate-600 text-center md:text-left leading-relaxed text-sm">
                Pas de carte bleue requise. Renseignez simplement votre nom, le nom de votre entreprise et c'est parti.
              </p>
            </div>
            
            <div className="relative z-10 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-6 mx-auto md:mx-0 shadow-lg shadow-blue-200">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">Créez votre première facture</h3>
              <p className="text-slate-600 text-center md:text-left leading-relaxed text-sm">
                Remplissez les informations, ajoutez vos prestations et produits avec leurs prix. Le total et la TVA se calculent seuls.
              </p>
            </div>

            <div className="relative z-10 bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mb-6 mx-auto md:mx-0 shadow-lg shadow-emerald-200">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center md:text-left">Envoyez et encaissez</h3>
              <p className="text-slate-600 text-center md:text-left leading-relaxed text-sm">
                Téléchargez le PDF ou envoyez-le par email directement à votre client. Plus qu'à attendre votre virement ou paiement mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="temoignages" className="py-24 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-3">Ils nous font confiance</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 max-w-3xl mx-auto">
            Adopté par plus de 1 500 entrepreneurs ambitieux
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">
            Découvrez comment webFacture transforme le quotidien des agences, consultants et PME en Afrique.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex gap-1 mb-4 text-yellow-400">
                <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 mb-8 italic">
                "Un outil incroyable pour notre agence de marketing. Avant on faisait nos devis sur Excel, mais maintenant tout est centralisé. Le calcul de la TVA automatique est un vrai soulagement."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">M</div>
                <div>
                  <p className="font-bold text-sm text-slate-900">Marc Kouassi</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">Fondateur d'Agence 🇨🇮</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex gap-1 mb-4 text-yellow-400">
                <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 mb-8 italic">
                "Je gagne environ 4h par semaine. Les factures sont pros, le suivi des paiements est clair et j'ai enfin une vue globale sur l'argent qui doit rentrer."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">S</div>
                <div>
                  <p className="font-bold text-sm text-slate-900">Sarah Diop</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">Consultante Freelance 🇸🇳</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex gap-1 mb-4 text-yellow-400">
                <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" /> <Star size={18} fill="currentColor" />
              </div>
              <p className="text-slate-700 mb-8 italic">
                "La gestion de la TVA était mon pire cauchemar. Avec webFacture, c'est devenu un jeu d'enfant. Et mes clients apprécient le côté très moderne des PDF générés."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">P</div>
                <div>
                  <p className="font-bold text-sm text-slate-900">Paul Ekoto</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">Gérant de PME 🇨🇲</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">Investissement transparent</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 max-w-3xl mx-auto">
            Des tarifs clairs et transparents en Francs CFA
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">
            Pas de frais cachés. Choisissez l'abonnement qui vous correspond et faites grandir votre entreprise.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-left shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Plan Gratuit</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">Idéal pour se lancer et tester la plateforme sans pression.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">0</span>
                <span className="text-slate-500 font-medium"> FCFA / mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-green-500 shrink-0"/> Jusqu'à 5 factures / mois</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-green-500 shrink-0"/> Calcul de la TVA inclus</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-green-500 shrink-0"/> Gestion des clients basique</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-green-500 shrink-0"/> Support par email</li>
              </ul>
              <Link href="/signup" className="block w-full py-3 px-4 bg-slate-50 text-slate-700 text-center font-bold rounded-xl hover:bg-slate-100 transition-colors">
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-left shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide">
                LE PLUS POPULAIRE
              </div>
              <h3 className="text-xl font-bold text-white mb-2 mt-2">Plan Pro</h3>
              <p className="text-sm text-slate-400 mb-6 h-10">Pour les freelances et PME qui veulent facturer sans limite.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">5 000</span>
                <span className="text-slate-400 font-medium"> FCFA / mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-blue-400 shrink-0"/> <strong>Factures et devis illimités</strong></li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-blue-400 shrink-0"/> Personnalisation avancée</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-blue-400 shrink-0"/> Dashboard de suivi et statistiques</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-blue-400 shrink-0"/> Relances d'impayés en 1 clic</li>
                <li className="flex items-center gap-3 text-sm text-slate-300"><CheckCircle2 size={18} className="text-blue-400 shrink-0"/> <strong>Support prioritaire 7/7</strong></li>
              </ul>
              <Link href="/signup" className="block w-full py-3 px-4 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/30">
                Essayer Pro 14 jours gratuits
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-left shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Plan Business</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">Pour les équipes et agences nécessitant plus de contrôle.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">15 000</span>
                <span className="text-slate-500 font-medium"> FCFA / mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-slate-900 shrink-0"/> Tout du plan Pro</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-slate-900 shrink-0"/> Multi-utilisateurs (jusqu'à 5 comptes)</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-slate-900 shrink-0"/> Accès API et webhooks</li>
                <li className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={18} className="text-slate-900 shrink-0"/> Marque blanche (pas de logo wf)</li>
              </ul>
              <Link href="/contact" className="block w-full py-3 px-4 bg-slate-50 text-slate-700 text-center font-bold rounded-xl hover:bg-slate-100 transition-colors">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden sky-watercolor-bg">
        <div className="absolute inset-0 bg-slate-900/90 mix-blend-overlay"></div>
        {/* Ambient Glowing Orbs */}
        <div className="ambient-orb orb-1" style={{ top: '-10%', left: '20%' }}></div>
        <div className="ambient-orb orb-2" style={{ bottom: '-15%', right: '15%' }}></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-900/50">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-6 tracking-tight">
            Rejoins les entrepreneurs qui facturent comme des pros
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Commencez dès aujourd'hui sans carte bancaire et générez votre première facture certifiée en 3 minutes.
          </p>
          <Link href="/signup" className="btn-interactive shimmer-active group inline-flex items-center gap-3 bg-white text-slate-900 text-base font-semibold pl-8 pr-2.5 py-2.5 rounded-full shadow-xl">
            <span className="relative z-10">Commencer gratuitement</span>
            <span className="relative z-10 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-950 group-hover:translate-x-1.5 group-hover:scale-105 transition-all duration-300">
              <ArrowRight size={20} strokeWidth={2.5} />
            </span>
          </Link>
          <p className="mt-6 text-sm text-slate-500">
            Aucun engagement • Annulable à tout moment • Support dédié
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-white mb-6">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
                  <FileText size={14} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-lg tracking-tight">webFacture</span>
              </div>
              <p className="mb-6 leading-relaxed">
                Le premier logiciel de facturation pensé pour les entrepreneurs et PME en Afrique de l'Ouest et Centrale.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Produit</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Témoignages clients</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Modèles de factures</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Entreprise</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-blue-400 transition-colors">À propos de nous</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog & Ressources</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Partenaires</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Légal & Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Conditions Générales</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Centre d'aide (FAQ)</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 webFacture. Tous droits réservés.</p>
            <p>Fait avec passion pour l'économie régionale. (Devises : FCFA / XOF / XAF)</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

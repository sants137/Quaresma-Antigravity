import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Calendar, Headphones, CheckCircle2, ShieldCheck, HeartHandshake, ChevronDown, Lock, Star, Cross, Scroll, Flame, Play, MessageCircle, HelpCircle, Plus, Minus, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { SalesPageProps } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

// Workaround for TypeScript errors with framer-motion types
const MotionDiv = motion.div as any;

const FAQItem = ({ question, answer }: { question: string, answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-300 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 md:py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className={`font-serif font-bold text-base md:text-xl transition-colors ${isOpen ? 'text-purple-900' : 'text-stone-800 group-hover:text-purple-800'}`}>
          {question}
        </span>
        <div className={`p-1.5 md:p-2 rounded-full transition-colors flex-shrink-0 ml-4 ${isOpen ? 'bg-purple-100 text-purple-900' : 'bg-transparent text-stone-400'}`}>
          {isOpen ? <Minus className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 md:pb-8 pr-4 md:pr-8 text-stone-600 font-sans text-base md:text-lg leading-relaxed">
              {answer}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SalesPage: React.FC<SalesPageProps> = ({ userName }) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { trackSalesPageView, trackCheckout, trackInteraction } = useAnalytics();

  const testimonials = [
    {
      type: 'video',
      name: 'Mariana S.',
      label: 'Recuperei minha vida de oração',
      img: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=600'
    },
    {
      type: 'text',
      name: 'Ricardo P.',
      source: 'Instagram',
      text: '"Eu sempre começava a Quaresma empolgado e parava na segunda semana. O Diário foi o que mudou tudo. Ter um \'roteiro\' diário me manteve fiel até a Páscoa. Foi a primeira vez que chorei na Sexta-Feira Santa de verdade."'
    },
    {
      type: 'print',
      name: 'Ana Clara',
      source: 'WhatsApp',
      text: 'Padre, o guia de confissão é incrível. Nunca tinha me confessado com tanta clareza. Obrigado!',
      time: '14:30'
    },
    {
      type: 'video',
      name: 'Carlos M.',
      label: 'Encontrei disciplina',
      img: 'https://images.unsplash.com/photo-1509059852496-f382216640f0?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    trackSalesPageView();

    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
      trackInteraction();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCheckout = () => {
    trackInteraction();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuyClick = () => {
    trackCheckout();
    window.location.href = 'https://pay.kirvano.com/0af5e645-151e-4e5c-a1a4-f509cdb6caae';
  };

  const Divider = () => (
    <div className="flex items-center justify-center py-8 md:py-12 opacity-40">
      <div className="h-px bg-gold-700 w-16 md:w-24"></div>
      <div className="mx-4 text-gold-700 font-serif text-xl">✤</div>
      <div className="h-px bg-gold-700 w-16 md:w-24"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper-100 text-stone-900 font-sans pb-20 bg-paper-texture overflow-x-hidden w-full">

      {/* 1. Hero Section - Solenidade */}
      <header className="relative bg-purple-900 text-white pt-16 pb-20 md:pt-24 md:pb-32 px-4 overflow-hidden border-b-8 border-gold-700">
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-900 to-purple-800 opacity-90"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 md:space-y-10">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Logo Customizado */}
            <div className="mb-6 md:mb-8">
              <img
                src="https://i.ibb.co/6cyR4srs/logotrans-guia-quaresma.png"
                alt="Guia Quaresmal 2026"
                className="w-48 md:w-64 h-auto mx-auto opacity-95 drop-shadow-xl"
              />
            </div>

            <h1 className="text-3xl md:text-7xl font-serif font-bold leading-tight mb-6 md:mb-8 drop-shadow-lg">
              Um método espiritual <br />
              para viver a Quaresma <br />
              <span className="text-gold-400 italic font-normal text-2xl md:text-6xl">como a Igreja pede.</span>
            </h1>
            <p className="text-lg md:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed font-sans font-light">
              Sem confusão, sem sentimentalismo, sem desistir na segunda semana. <br />
              Apenas a <span className="font-semibold text-white">ordem</span> que sua alma precisa.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 text-xs md:text-base text-gold-100/80 font-serif tracking-wide mt-6 md:mt-8 uppercase"
          >
            <div className="flex items-center"><Star className="w-3 h-3 md:w-4 md:h-4 mr-2 text-gold-500" /> Direção Segura</div>
            <div className="hidden md:block text-gold-700">•</div>
            <div className="flex items-center"><Star className="w-3 h-3 md:w-4 md:h-4 mr-2 text-gold-500" /> Fidelidade à Tradição</div>
            <div className="hidden md:block text-gold-700">•</div>
            <div className="flex items-center"><Star className="w-3 h-3 md:w-4 md:h-4 mr-2 text-gold-500" /> Conversão Real</div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="pt-8 md:pt-10"
          >
            <Button variant="secondary" onClick={scrollToCheckout} size="lg" className="text-base md:text-lg py-4 md:py-5 px-8 md:px-10 shadow-2xl shadow-black/50 border-2 border-gold-500/30">
              Assumir meu compromisso
            </Button>
          </MotionDiv>
        </div>
      </header>

      {/* 2. Pain Points - Realidade da Alma */}
      <section className="py-12 md:py-24 px-4 max-w-3xl mx-auto text-center md:text-left relative">
        <h2 className="text-2xl md:text-5xl font-serif font-bold text-stone-900 mb-8 md:mb-10 text-center leading-tight">
          A maioria dos católicos vive a Quaresma… <br />
          <span className="text-stone-500 italic font-serif text-xl md:text-4xl">mas quase ninguém sabe como vivê-la.</span>
        </h2>

        <div className="space-y-6 md:space-y-8 text-lg md:text-xl text-stone-800 leading-relaxed font-sans text-justify md:text-center">
          <p>Todo ano a história se repete.</p>
          <p>Cinzas na testa. Uma boa intenção. Talvez cortar o doce ou o álcool. Algumas orações a mais nos primeiros dias.</p>

          <div className="bg-paper-50 p-6 md:p-8 rounded-sm border-l-4 border-red-900 shadow-lg my-8 md:my-12 mx-auto max-w-xl">
            <p className="font-serif font-bold text-lg md:text-xl mb-4 md:mb-6 text-red-900 uppercase tracking-widest text-center">O Ciclo do Fracasso</p>
            <ul className="space-y-3 md:space-y-4 font-serif text-base md:text-lg">
              <li className="flex items-center"><span className="text-red-900 mr-3 text-xl md:text-2xl">†</span> o cansaço mundano chega</li>
              <li className="flex items-center"><span className="text-red-900 mr-3 text-xl md:text-2xl">†</span> a rotina engole o silêncio</li>
              <li className="flex items-center"><span className="text-red-900 mr-3 text-xl md:text-2xl">†</span> a disciplina vira peso</li>
              <li className="flex items-center"><span className="text-red-900 mr-3 text-xl md:text-2xl">†</span> a Páscoa chega vazia</li>
            </ul>
          </div>

          <p className="font-medium text-center text-xl md:text-2xl text-stone-900">
            Não é falta de fé, {userName}. <br />
            É falta de <span className="text-purple-900 font-bold bg-purple-50 px-2 border-b-2 border-purple-200">método espiritual</span>.
          </p>
        </div>
      </section>

      <Divider />

      {/* 3. Authority - Tradição */}
      <section className="bg-stone-200 py-12 md:py-24 px-4 border-y border-stone-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 mb-6 md:mb-8">
            A Quaresma não é um fardo.<br />
            <span className="text-purple-900">É uma estrada real.</span>
          </h2>
          <p className="text-lg md:text-xl text-stone-700 max-w-2xl mx-auto mb-10 md:mb-16 font-sans">
            Durante séculos, a Igreja ensinou a penitência como medicina para a alma, não como tortura sem sentido.
          </p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-left">
            <div className="prose prose-stone prose-lg font-sans">
              <p>
                Hoje, tudo virou superficial. As pregações são genéricas, os propósitos são fracos ("faça o que der") e a alma continua faminta de Deus.
              </p>
              <p className="mt-4 font-bold text-stone-900">
                Precisamos voltar ao essencial:
              </p>
              <ul className="mt-4 space-y-2 text-stone-700 list-none pl-4 border-l-2 border-gold-600">
                <li className="mb-2">Ordem na oração</li>
                <li className="mb-2">Penitência com sentido</li>
                <li className="mb-2">Caridade concreta</li>
              </ul>
            </div>
            <div className="bg-paper-50 p-8 md:p-10 rounded-sm shadow-xl border-2 border-double border-stone-300 relative mt-6 md:mt-0">
              <span className="absolute -top-4 -left-4 text-6xl text-gold-400 font-serif">“</span>
              <p className="text-lg md:text-xl italic text-stone-800 font-serif leading-relaxed relative z-10">
                Este guia existe para restaurar o sentido original da Quaresma. Não é inovação. É o resgate do que sempre funcionou para formar santos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Presentation - O Tesouro */}
      <section className="py-12 md:py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-gold-600 font-serif tracking-widest uppercase text-xs md:text-sm font-bold">O Conteúdo</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-purple-900 mt-2 md:mt-4 mb-4 md:mb-6">O Guia Quaresmal 2026</h2>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-sans">Um itinerário de 40 dias para purificação, disciplina e união com Deus.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-stone-200 hover:border-purple-300 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-900 transition-colors duration-300">
              <Book className="text-purple-900 w-6 h-6 md:w-7 md:h-7 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-stone-900">1. O Guia Base</h3>
            <ul className="space-y-3 md:space-y-4 text-stone-700 font-sans">
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> O que a Igreja e os Santos ensinam</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> A anatomia do Jejum correto</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Como escolher penitências que convertem</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-stone-200 hover:border-purple-300 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-900 transition-colors duration-300">
              <Calendar className="text-purple-900 w-6 h-6 md:w-7 md:h-7 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-stone-900">2. O Diário (40 Dias)</h3>
            <ul className="space-y-3 md:space-y-4 text-stone-700 font-sans">
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Tema espiritual profundo por dia</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Ação concreta (não abstrata)</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Exame de consciência noturno</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-stone-200 hover:border-purple-300 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-900 transition-colors duration-300">
              <Headphones className="text-purple-900 w-6 h-6 md:w-7 md:h-7 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-stone-900">3. Áudios Curtos Diários</h3>
            <ul className="space-y-3 md:space-y-4 text-stone-700 font-sans">
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Direção espiritual objetiva</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Para ouvir no trânsito ou na oração</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Apenas 3 a 5 minutos</li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-stone-200 hover:border-purple-300 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-900 transition-colors duration-300">
              <ShieldCheck className="text-purple-900 w-6 h-6 md:w-7 md:h-7 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-stone-900">4. Ferramentas Práticas</h3>
            <ul className="space-y-3 md:space-y-4 text-stone-700 font-sans">
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Exame profundo para Confissão Geral</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Planner de Penitência pessoal</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Guia Litúrgico da Semana Santa</li>
            </ul>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-stone-200 hover:border-purple-300 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-900 transition-colors duration-300">
              <Scroll className="text-purple-900 w-6 h-6 md:w-7 md:h-7 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-stone-900">5. Plano de Ação Espiritual</h3>
            <ul className="space-y-3 md:space-y-4 text-stone-700 font-sans">
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Rotina de oração para leigos</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Mortificações progressivas</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Leitura espiritual organizada</li>
            </ul>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-stone-200 hover:border-purple-300 transition-all duration-300 group">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:bg-purple-900 transition-colors duration-300">
              <Flame className="text-purple-900 w-6 h-6 md:w-7 md:h-7 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 text-stone-900">6. Guia de Meditações Profundas</h3>
            <ul className="space-y-3 md:space-y-4 text-stone-700 font-sans">
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Via Sacra meditada</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Meditações da Paixão</li>
              <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-gold-600 flex-shrink-0 mt-0.5" /> Textos dos Santos Padres</li>
            </ul>
          </div>
        </div>
      </section>

      {/* NEW: Testimonials Carousel */}
      <section className="bg-stone-50 py-12 md:py-20 px-4 border-y border-stone-200 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className="text-gold-600 font-serif tracking-widest uppercase text-xs md:text-sm font-bold">TESTEMUNHOS</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mt-2 md:mt-4">
              O que dizem os participantes de 2025
            </h2>
            <div className="w-16 md:w-24 h-0.5 bg-stone-300 mx-auto mt-4 md:mt-6" />
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="relative min-h-[320px] md:min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode='wait'>
                <MotionDiv
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-2xl px-2 md:px-8"
                >
                  {testimonials[currentTestimonial].type === 'video' ? (
                    <div className="bg-stone-900 rounded-sm aspect-[16/9] md:aspect-[21/9] relative group overflow-hidden shadow-2xl border-4 border-white mx-auto max-w-xl">
                      <img
                        src={testimonials[currentTestimonial].img}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 cursor-pointer hover:bg-white/30 transition-all">
                          <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent text-left">
                        <p className="text-white font-serif font-bold text-base md:text-lg">{testimonials[currentTestimonial].name}</p>
                        <p className="text-stone-300 text-xs md:text-sm font-sans italic">"{testimonials[currentTestimonial].label}"</p>
                      </div>
                    </div>
                  ) : testimonials[currentTestimonial].type === 'text' ? (
                    <div className="bg-white p-6 md:p-12 rounded-sm shadow-xl border border-stone-200 text-center relative">
                      <Quote className="w-8 h-8 md:w-10 md:h-10 text-purple-200 absolute top-3 left-3 md:top-4 md:left-4" />
                      <p className="text-stone-700 font-sans italic text-lg md:text-2xl mb-6 relative z-10 leading-relaxed">
                        {testimonials[currentTestimonial].text}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-900 rounded-full flex items-center justify-center font-serif font-bold text-white text-xs md:text-sm">
                          {testimonials[currentTestimonial].name ? testimonials[currentTestimonial].name.charAt(0) : ''}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-sm md:text-base text-stone-900">{testimonials[currentTestimonial].name}</div>
                          <div className="text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">{testimonials[currentTestimonial].source}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Print Style
                    <div className="bg-white p-4 md:p-6 rounded-sm shadow-xl border border-stone-200 max-w-sm md:max-w-md mx-auto">
                      <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-3">
                        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                        <div>
                          <div className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-wider">WhatsApp</div>
                          <div className="text-xs text-stone-400">{testimonials[currentTestimonial].name}</div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 md:p-4 rounded-lg rounded-tl-none text-stone-800 text-sm md:text-base font-sans mb-2 text-left relative">
                        {testimonials[currentTestimonial].text}
                        <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[10px] border-t-green-50 border-l-[10px] border-l-transparent"></div>
                      </div>
                      <div className="text-right text-[10px] text-stone-400">Enviado às {testimonials[currentTestimonial].time}</div>
                    </div>
                  )}
                </MotionDiv>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-12 p-2 bg-white border border-stone-200 rounded-full shadow-lg hover:bg-stone-50 text-stone-600 transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-12 p-2 bg-white border border-stone-200 rounded-full shadow-lg hover:bg-stone-50 text-stone-600 transition-all z-10"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === currentTestimonial ? 'bg-purple-900 scale-110' : 'bg-stone-300 hover:bg-stone-400'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <p className="text-stone-500 italic font-serif text-sm md:text-base">
              Junte-se a mais de 2.000 almas que transformaram sua Semana Santa.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Transformation - Metanoia */}
      <section className="bg-purple-900 text-white py-16 md:py-24 px-4 border-t-4 border-gold-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 md:mb-12">Você não terminará como começou.</h2>
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 text-left">
            <div className="bg-purple-800/50 p-6 md:p-8 rounded-sm border border-purple-700 backdrop-blur-sm">
              <h4 className="font-serif font-bold text-stone-400 mb-3 md:mb-4 text-lg md:text-xl uppercase tracking-wider">O Velho Homem</h4>
              <p className="text-purple-100 font-sans text-base md:text-lg">Oração dispersa. Vontade fraca. Vive a Semana Santa como um feriado qualquer. Sente um vazio no Domingo de Páscoa.</p>
            </div>
            <div className="bg-paper-100 text-stone-900 p-6 md:p-8 rounded-sm shadow-2xl transform sm:scale-105 border-2 border-gold-500">
              <h4 className="font-serif font-bold text-purple-900 mb-3 md:mb-4 text-lg md:text-xl uppercase tracking-wider">O Homem Novo</h4>
              <p className="text-stone-800 font-sans text-base md:text-lg">Consciência sensível. Disciplina interior. Vive a Paixão com lágrimas e a Páscoa com uma alegria sobrenatural verdadeira.</p>
            </div>
          </div>
          <p className="mt-10 md:mt-16 font-serif italic text-xl md:text-2xl text-gold-200">"Não por sentimento. Por fidelidade."</p>
        </div>
      </section>

      {/* 6. Pricing - A Oferta */}
      <section id="pricing" className="py-12 md:py-24 px-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg p-6 md:p-16 border-2 border-double border-stone-200 shadow-2xl relative">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-10 h-10 md:w-16 md:h-16 border-t-2 border-l-2 border-stone-300"></div>
          <div className="absolute top-4 right-4 w-10 h-10 md:w-16 md:h-16 border-t-2 border-r-2 border-stone-300"></div>
          <div className="absolute bottom-4 left-4 w-10 h-10 md:w-16 md:h-16 border-b-2 border-l-2 border-stone-300"></div>
          <div className="absolute bottom-4 right-4 w-10 h-10 md:w-16 md:h-16 border-b-2 border-r-2 border-stone-300"></div>

          <div className="text-center mb-10 md:mb-16 relative z-10">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mb-4">“Mas se é espiritual… deve ser gratuito?”</h2>
            <p className="text-stone-600 max-w-2xl mx-auto font-sans text-base md:text-lg">
              "O operário merece seu sustento." Este projeto não visa lucro, mas sustentabilidade e alcance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
            <div>
              <h3 className="font-serif font-bold text-lg md:text-xl mb-4 md:mb-6 text-stone-800">Sua contribuição sustenta:</h3>
              <ul className="space-y-3 md:space-y-4 text-stone-600 mb-6 md:mb-8 font-sans">
                <li className="flex items-center"><div className="w-2 h-2 bg-gold-600 rotate-45 mr-3"></div> Custos de produção e edição</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-gold-600 rotate-45 mr-3"></div> Hospedagem da plataforma</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-gold-600 rotate-45 mr-3"></div> Anúncios para alcançar almas afastadas</li>
              </ul>
              <div className="bg-purple-50 p-4 md:p-5 rounded-sm border border-purple-100">
                <p className="text-purple-900 font-bold text-xs md:text-sm flex items-center font-serif">
                  <HeartHandshake className="w-5 h-5 mr-3" />
                  Todo valor excedente será doado para obras de caridade.
                </p>
              </div>
            </div>

            <div className="bg-paper-50 p-6 md:p-8 rounded-sm shadow-xl border border-gold-200 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-600 to-gold-400"></div>
              <div className="text-xs md:text-sm font-serif tracking-widest text-stone-500 mb-3 md:mb-4 uppercase">Acesso Vitalício + Bônus</div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-purple-900 mb-2">R$ 29,90</div>
              <div className="text-xs md:text-sm text-stone-500 mb-6 md:mb-8 font-sans">Pagamento único (menos que um lanche)</div>
              <Button fullWidth size="lg" className="mb-4 md:mb-6 shadow-xl py-4" onClick={handleBuyClick}>
                GARANTIR MEU ACESSO
              </Button>
              <div className="flex justify-center items-center text-xs text-stone-400 gap-2 font-sans">
                <Lock className="w-3 h-3" /> Pagamento seguro e criptografado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: FAQ Section */}
      <section className="py-12 md:py-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-8 h-8 md:w-10 md:h-10 text-stone-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4 md:mb-6">
            Dúvidas Frequentes
          </h2>
        </div>

        <div className="bg-white p-4 md:p-8 rounded-sm shadow-lg border border-stone-200">
          <div className="space-y-1 md:space-y-2">
            <FAQItem
              question="Para quem é o Guia da Quaresma?"
              answer="Para católicos (ou quem busca a fé) que desejam viver este tempo litúrgico com profundidade, saindo do automatismo e buscando uma conversão real através da tradição bimilenar da Igreja. É ideal para quem sente que suas Quaresmas passadas foram 'mornas' ou desorganizadas."
            />
            <FAQItem
              question="Quais recursos exclusivos a Quaresma Oferece?"
              answer={
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Guia Base:</strong> Fundamentos teológicos e práticos do jejum e abstinência.</li>
                  <li><strong>Diário de 40 Dias:</strong> Um roteiro dia a dia com meditações e ações.</li>
                  <li><strong>Áudios Curtos (Vox Clamantis):</strong> Direção espiritual diária em áudio.</li>
                  <li><strong>Planner de Penitência:</strong> Para organizar seus propósitos.</li>
                  <li><strong>Exame de Consciência:</strong> Um guia profundo para uma confissão geral.</li>
                </ul>
              }
            />
            <FAQItem
              question="Posso acessar o guia da Quaresma a qualquer momento?"
              answer="Sim. O acesso é digital e vitalício. Você receberá um login para nossa área de membros, onde poderá baixar os PDFs e ouvir os áudios quando e onde quiser, inclusive em anos futuros."
            />
            <FAQItem
              question="Como faço para adquirir o Guia?"
              answer="Basta clicar em qualquer botão 'Garantir meu Acesso' ou 'Quero Viver a Quaresma' nesta página. Você será direcionado para um checkout seguro onde poderá realizar o pagamento único de R$ 29,90 via Pix ou Cartão."
            />
            <FAQItem
              question="A compra é segura?"
              answer="Sim. Utilizamos uma plataforma de pagamentos criptografada e segura, líder de mercado, que protege 100% dos seus dados."
            />
            <FAQItem
              question="E se eu não gostar do guia?"
              answer="Garantimos que é impossível a insatisfação com o guia, mas se isso ainda sim acontecer, nós devolvemos seu dinheiro."
            />
          </div>
        </div>
      </section>

      {/* NEW: Warranty Section */}
      <section className="py-12 md:py-20 px-4 max-w-4xl mx-auto text-center border-t border-stone-200">
        <div className="bg-stone-50 border border-stone-200 p-8 md:p-12 rounded-lg relative overflow-hidden">
          {/* Decorative Background Icon */}
          <ShieldCheck className="w-64 h-64 text-stone-100 absolute -right-10 -bottom-10 opacity-50 rotate-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-green-200 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-sm">
              <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-green-700" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 mb-3 md:mb-4">Garantia Incondicional de 7 Dias</h3>
            <p className="text-stone-600 font-sans text-base md:text-lg max-w-2xl mx-auto">
              Seu risco é zero. Adquira o Guia Quaresmal 2026, acesse todo o conteúdo, e se por qualquer motivo você achar que não valeu o investimento, devolvemos 100% do seu dinheiro. Sem letras miúdas.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Transparency */}
      <section className="py-8 md:py-12 px-4 max-w-3xl mx-auto">
        <div className="bg-amber-50/50 p-6 md:p-8 rounded-sm border border-amber-100 text-center">
          <h3 className="font-serif font-bold text-amber-900 flex items-center justify-center mb-3 md:mb-4 uppercase tracking-wider text-xs md:text-sm">
            Compromisso Público
          </h3>
          <ul className="space-y-1 md:space-y-2 text-amber-900/80 text-xs md:text-sm font-sans">
            <li>Este projeto é independente e fiel ao Magistério da Igreja.</li>
            <li>Não há enriquecimento pessoal envolvido.</li>
            <li>Prestaremos contas do destino dos recursos excedentes.</li>
          </ul>
        </div>
      </section>

      {/* 8. Final CTA - Memento Mori (Updated Colors) */}
      <section className="py-16 md:py-24 px-4 text-center bg-purple-900 text-white relative border-t-8 border-gold-700 overflow-hidden">
        {/* Texture Overlay (Matching Hero) */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-800 via-purple-900 to-purple-950 opacity-90"></div>

        <div className="max-w-3xl mx-auto space-y-8 md:space-y-10 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">A Quaresma chegará. E passará.</h2>
          <p className="text-stone-300 text-lg md:text-xl font-sans font-light">
            Como você estará na manhã de Páscoa? <br />
            Igual a hoje... ou transformado pela Graça?
          </p>

          <div className="bg-white/5 p-4 md:p-6 rounded-sm inline-block border border-gold-500/30 backdrop-blur-sm">
            <p className="text-sm md:text-base text-gold-200 font-serif tracking-wide">📖 {userName}, seu nome já consta no Livro de Orações.</p>
          </div>

          <div className="pt-6 md:pt-8">
            <Button
              variant="secondary" // Usando secondary, mas com override abaixo para um acabamento mais premium
              className="text-base md:text-lg px-8 md:px-12 py-4 md:py-5 w-full md:w-auto font-bold tracking-widest !bg-gold-700 !border-gold-700 !text-purple-900 hover:!bg-gold-600 hover:!border-gold-600 shadow-2xl"
              onClick={handleBuyClick}
            >
              QUERO VIVER A QUARESMA
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Spiritual Closing */}
      <footer className="bg-purple-950 text-stone-400 py-12 md:py-16 text-center px-4 border-t border-purple-900">
        <div className="mb-6 md:mb-8 opacity-30 text-gold-600">
          <Cross className="w-6 h-6 md:w-8 md:h-8 mx-auto" />
        </div>
        <p className="font-serif italic text-lg md:text-xl mb-3 md:mb-4 text-stone-400">“Convertei-vos a mim de todo o vosso coração.”</p>
        <p className="text-xs uppercase tracking-widest text-stone-500 font-bold mb-10 md:mb-12">(Joel 2,12)</p>
        <p className="text-[10px] md:text-xs opacity-40 font-serif">© 2026 Guia Quaresmal. Ad Majorem Dei Gloriam.</p>
      </footer>

      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {scrolled && (
          <MotionDiv
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full bg-paper-50 border-t border-gold-200 p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.2)] lg:hidden z-[100] flex justify-between items-center"
          >
            <div className="text-sm">
              <p className="font-serif font-bold text-purple-900">Guia 2026</p>
              <p className="text-xs text-stone-500">Apenas R$ 29,90</p>
            </div>
            <Button size="sm" onClick={scrollToCheckout} className="px-6 text-xs uppercase tracking-wider">
              Começar
            </Button>
          </MotionDiv>
        )}
      </AnimatePresence>

    </div>
  );
};
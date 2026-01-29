import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Calendar, Filter, MousePointer, Users, ShoppingCart, Percent, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAnalytics } from '../hooks/useAnalytics';
import { DashboardProps } from '../types';

// Workaround for TypeScript errors with framer-motion types
const MotionDiv = motion.div as any;

export const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const { metrics, clearDatabase, refreshMetrics, isLoading } = useAnalytics();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State do Modal de Confirmação
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Manipular Reset
  const handleReset = async () => {
    if (deleteConfirmation !== 'DELETAR') return;

    setIsDeleting(true);
    const result = await clearDatabase();
    setIsDeleting(false);

    if (result.success) {
      alert('Banco de dados limpo com sucesso.');
      setIsResetModalOpen(false);
      setDeleteConfirmation('');
    } else {
      alert(result.error || 'Erro ao limpar banco.');
    }
  };

  // Carrega os dados ao abrir o dashboard
  useEffect(() => {
    refreshMetrics();
  }, []);

  // Filtrar e agregar dados
  const aggregatedData = useMemo(() => {
    let filtered = metrics;

    if (startDate) {
      filtered = filtered.filter(m => m.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(m => m.date <= endDate);
    }

    const total = {
      visits: 0,
      interactions: 0,
      steps: {
        intro: 0,
        name: 0,
        assessment: 0,
        routine: 0,
        intention: 0,
        intention: 0,
        audio_message: 0,
        transition: 0
      } as Record<string, number>,
      salesPageViews: 0,
      checkouts: 0
    };

    filtered.forEach(day => {
      total.visits += day.visits;
      total.interactions += day.interactions;
      total.salesPageViews += day.salesPageViews;
      total.checkouts += day.checkouts;

      Object.keys(day.steps).forEach(step => {
        total.steps[step] = (total.steps[step] || 0) + day.steps[step];
      });
    });

    return total;
  }, [metrics, startDate, endDate]);

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const FunnelBar = ({ label, value, total, color = "bg-purple-600" }: { label: string, value: number, total: number, color?: string }) => {
    const percent = calculatePercentage(value, total);
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-stone-700">{label}</span>
          <span className="text-stone-500">{value} eventos ({percent}%)</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-4 overflow-hidden">
          <MotionDiv
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1 }}
            className={`h-full ${color}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-stone-600" />
            </button>
            <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-2">
              Dashboard Online
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-200">Supabase</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={refreshMetrics}>
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(true)} className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" /> Resetar DB
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 text-purple-900 animate-spin" />
            <p className="text-stone-500">Buscando dados no banco de dados...</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 mb-8 flex flex-wrap gap-4 items-center">
              <Filter className="w-5 h-5 text-stone-400" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">De:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-stone-300 rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">Até:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-stone-300 rounded px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-stone-500 text-sm font-medium">Total de Visitas</h3>
                  <Users className="w-5 h-5 text-purple-900 opacity-50" />
                </div>
                <p className="text-3xl font-bold text-stone-900">{aggregatedData.visits}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-stone-500 text-sm font-medium">Taxa de Interação</h3>
                  <MousePointer className="w-5 h-5 text-blue-600 opacity-50" />
                </div>
                <p className="text-3xl font-bold text-stone-900">
                  {calculatePercentage(aggregatedData.interactions, aggregatedData.visits)}%
                </p>
                <p className="text-xs text-stone-400 mt-1">{aggregatedData.interactions} interações únicas</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-stone-500 text-sm font-medium">Chegou no Checkout</h3>
                  <ShoppingCart className="w-5 h-5 text-green-600 opacity-50" />
                </div>
                <p className="text-3xl font-bold text-stone-900">
                  {calculatePercentage(aggregatedData.checkouts, aggregatedData.salesPageViews)}%
                </p>
                <p className="text-xs text-stone-400 mt-1">Conversão da Página de Vendas</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-stone-500 text-sm font-medium">Conversão Global</h3>
                  <Percent className="w-5 h-5 text-amber-600 opacity-50" />
                </div>
                <p className="text-3xl font-bold text-stone-900">
                  {calculatePercentage(aggregatedData.checkouts, aggregatedData.visits)}%
                </p>
                <p className="text-xs text-stone-400 mt-1">Visitas → Venda (Clique)</p>
              </div>
            </div>

            {/* Funnel Visualization */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Funil do Quiz (Eventos Totais)</h3>
                <div className="space-y-6">
                  <FunnelBar label="Acessou o Site (Intro)" value={aggregatedData.visits} total={aggregatedData.visits} color="bg-stone-400" />
                  <FunnelBar label="Foi para Nome" value={aggregatedData.steps['name'] || 0} total={aggregatedData.visits} />
                  <FunnelBar label="Respondeu Avaliação" value={aggregatedData.steps['assessment'] || 0} total={aggregatedData.visits} />
                  <FunnelBar label="Respondeu Rotina" value={aggregatedData.steps['routine'] || 0} total={aggregatedData.visits} />
                  <FunnelBar label="Respondeu Intenção" value={aggregatedData.steps['intention'] || 0} total={aggregatedData.visits} />
                  <FunnelBar label="Ouviu Áudio" value={aggregatedData.steps['audio_message'] || 0} total={aggregatedData.visits} />
                  <FunnelBar label="Viu Resultado" value={aggregatedData.steps['transition'] || 0} total={aggregatedData.visits} />
                  <FunnelBar label="Visualizou Página de Vendas" value={aggregatedData.salesPageViews} total={aggregatedData.visits} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Funil de Vendas</h3>
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 mb-6">
                  <div className="text-sm font-medium text-stone-500 mb-1">Visualizou Página de Vendas</div>
                  <div className="text-2xl font-bold text-stone-900">{aggregatedData.salesPageViews}</div>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="bg-stone-200 w-0.5 h-8"></div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-green-800 mb-1">Clicou em Comprar</div>
                      <div className="text-2xl font-bold text-green-900">{aggregatedData.checkouts}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {calculatePercentage(aggregatedData.checkouts, aggregatedData.salesPageViews)}%
                      </div>
                      <div className="text-xs text-green-700">Taxa de Clique</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-sm text-stone-500">
                  <p className="mb-2"><strong>Nota:</strong> Dados buscados diretamente do seu projeto Supabase.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Os dados são agregados por data.</li>
                    <li>Apenas os últimos 5000 eventos são carregados para manter a performance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Modal de Confirmação de Reset */}
        {isResetModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />

              <h3 className="text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Apagar Histórico?
              </h3>

              <p className="text-stone-600 mb-6 font-sans">
                Esta ação <strong className="text-red-700">não pode ser desfeita</strong>.
                Todos os dados de visitas e respostas do quiz serão perdidos permanentemente.
              </p>

              <div className="mb-6 space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Digite "DELETAR" para confirmar
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETAR"
                  className="w-full border border-stone-300 rounded p-3 text-lg font-mono focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => { setIsResetModalOpen(false); setDeleteConfirmation(''); }}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className={deleteConfirmation !== 'DELETAR' ? 'opacity-50 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'}
                  disabled={deleteConfirmation !== 'DELETAR' || isDeleting}
                >
                  {isDeleting ? 'Apagando...' : 'Apagar Tudo'}
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DailyMetric, AnalyticsEvent } from '../types';

const SESSION_KEY = 'quaresma_session_active';
const IGNORE_ANALYTICS_KEY = 'quaresma_ignore_analytics';
const SESSION_ID_KEY = 'quaresma_analytics_sid';

export const useAnalytics = () => {
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Gera ou recupera um ID único para esta sessão para podermos apagar os dados depois se for admin
  const [sessionId] = useState<string>(() => {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  });

  const logEvent = async (event: AnalyticsEvent) => {
    // Se a flag de ignorar estiver ativa, não faz nada
    if (sessionStorage.getItem(IGNORE_ANALYTICS_KEY)) return;

    try {
      const { error } = await supabase.from('analytics_events').insert({
        event_type: event.event_type,
        step_name: event.step_name || null,
        // Injetamos o Session ID no metadata para rastreabilidade
        metadata: {
          ...(event.metadata || {}),
          sessionId: sessionId
        }
      });

      if (error) {
        // Silenciosamente ignorar erros de RLS no frontend para não atrapalhar o usuário
        if (error.code === '42501' || error.code === 'PGRST301') {
          console.warn('Analytics bloqueado por política de segurança (RLS). Verifique as permissões de INSERT para role "anon".');
        } else {
          console.error('Erro ao salvar analytics:', error.message);
        }
      }
    } catch (error) {
      console.error('Erro de conexão analytics:', error);
    }
  };

  // Função chamada quando detectamos login de admin
  const ignoreCurrentSession = async () => {
    try {
      // 1. Marca para não enviar mais nada daqui para frente
      sessionStorage.setItem(IGNORE_ANALYTICS_KEY, 'true');

      // 2. Apaga o histórico retroativo desta sessão específica no banco
      const currentSid = sessionId;

      const { error } = await supabase
        .from('analytics_events')
        .delete()
        .contains('metadata', { sessionId: currentSid });

      if (error) {
        console.warn('Não foi possível limpar a sessão (Provável bloqueio de RLS para DELETE).', error.message);
      } else {
        console.log('Sessão administrativa detectada. Histórico limpo.');
      }
    } catch (error) {
      console.error('Erro ao limpar sessão administrativa:', error);
    }
  };

  const trackVisit = () => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      logEvent({ event_type: 'visit' });
    }
  };

  const trackInteraction = () => {
    if (!sessionStorage.getItem('has_interacted')) {
      sessionStorage.setItem('has_interacted', 'true');
      logEvent({ event_type: 'interaction' });
    }
  };

  const trackStep = (stepName: string) => {
    const stepKey = `viewed_step_${stepName}`;

    if (!sessionStorage.getItem(stepKey)) {
      sessionStorage.setItem(stepKey, 'true');
      logEvent({ event_type: 'step', step_name: stepName });
    }
  };

  const trackSalesPageView = () => {
    const salesKey = 'viewed_sales_page';

    if (!sessionStorage.getItem(salesKey)) {
      sessionStorage.setItem(salesKey, 'true');
      logEvent({ event_type: 'sales_view' });
    }
  };

  const trackCheckout = () => {
    const checkoutKey = 'clicked_checkout';

    if (!sessionStorage.getItem(checkoutKey)) {
      sessionStorage.setItem(checkoutKey, 'true');
      logEvent({ event_type: 'checkout' });
    }
  };

  const loadMetrics = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(5000);

    if (error) {
      console.error('Erro ao buscar métricas:', error);
      if (error.code === '42501' || error.code === 'PGRST301') {
        alert('Acesso negado às métricas. Verifique as Políticas de Segurança (RLS) no Supabase para permitir SELECT na tabela analytics_events para a role "anon".');
      }
      setIsLoading(false);
      return;
    }

    const metricsMap: Record<string, DailyMetric> = {};

    data?.forEach((row: any) => {
      const date = row.created_at.split('T')[0];

      if (!metricsMap[date]) {
        metricsMap[date] = {
          date,
          visits: 0,
          interactions: 0,
          steps: {},
          salesPageViews: 0,
          checkouts: 0
        };
      }

      const day = metricsMap[date];

      switch (row.event_type) {
        case 'visit':
          day.visits++;
          break;
        case 'interaction':
          day.interactions++;
          break;
        case 'step':
          if (row.step_name) {
            day.steps[row.step_name] = (day.steps[row.step_name] || 0) + 1;
          }
          break;
        case 'sales_view':
          day.salesPageViews++;
          break;
        case 'checkout':
          day.checkouts++;
          break;
      }
    });

    setMetrics(Object.values(metricsMap).sort((a, b) => a.date.localeCompare(b.date)));
    setIsLoading(false);
  };

  async function clearDatabase(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('analytics_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error(error);
        if (error.code === '42501') {
          return { success: false, error: 'Erro de Permissão (RLS): Sua política de segurança no Supabase impede DELETE público.' };
        } else {
          return { success: false, error: 'Erro ao deletar. Verifique o console.' };
        }
      } else {
        sessionStorage.clear();
        setMetrics([]);
        return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'Erro desconhecido' };
    }
  };

  return {
    metrics,
    isLoading,
    trackVisit,
    trackInteraction,
    trackStep,
    trackSalesPageView,
    trackCheckout,
    clearDatabase,
    refreshMetrics: loadMetrics,
    ignoreCurrentSession // Exportando a nova função
  };
};
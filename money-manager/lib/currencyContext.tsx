'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SUPPORTED_CURRENCIES } from '@/lib/schemas';
import { supabase } from '@/lib/supabase';

type CurrencyContextType = {
  currency: string;
  symbol: string;
  formatAmount: (amount: number) => string;
};

const defaultCurrency = 'USD';
const defaultSymbol = '$';

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  symbol: defaultSymbol,
  formatAmount: (amount) => `${defaultSymbol}${amount.toFixed(2)}`,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState(defaultCurrency);
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's currency preference on mount
  useEffect(() => {
    const fetchCurrencyPreference = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // If no user, use default currency
          return;
        }

        // Try to get user preferences
        const { data, error } = await supabase
          .from('user_preferences')
          .select('currency')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching currency preference:', error);
          return;
        }

        if (data) {
          setCurrency(data.currency);
          // Find the symbol for this currency
          const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === data.currency);
          if (currencyInfo) {
            setSymbol(currencyInfo.symbol);
          }
        }
      } catch (error) {
        console.error('Error in currency preference fetching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencyPreference();
  }, []);

  // Listen for changes to the user_preferences table
  useEffect(() => {
    const channel = supabase
      .channel('user_preferences_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_preferences' 
        }, 
        async (payload: any) => {
          // When preferences change, refetch the currency
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          // Type check the payload
          if (payload.new && 
              typeof payload.new === 'object' && 
              'user_id' in payload.new && 
              'currency' in payload.new &&
              payload.new.user_id === user.id) {
            const newCurrency = payload.new.currency as string;
            setCurrency(newCurrency);
            const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === newCurrency);
            if (currencyInfo) {
              setSymbol(currencyInfo.symbol);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Format amount based on the selected currency
  const formatAmount = (amount: number): string => {
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, symbol, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

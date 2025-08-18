
import { useSecureConfig } from './useSecureStorage';

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
}

export const useAirtableConfig = () => {
  const {
    value: config,
    setValue: saveConfig,
    removeValue: clearConfig,
    hasValue: isConfigured,
    isLoading,
    error
  } = useSecureConfig<AirtableConfig>('airtableConfig');

  return {
    config,
    isConfigured,
    saveConfig,
    clearConfig,
    isLoading,
    error
  };
};

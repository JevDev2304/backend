export interface TokenizeCardParams {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }
  
  export interface CreateWompiTransactionParams {
    acceptance_token: string;
    accept_personal_auth: string;
    signature: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    reference: string;
    payment_method: {
      type: 'CARD';
      token: string;
      installments: number;
    };
  }
  
  export interface PollTransactionStatusParams {
    transactionId: string;
    maxRetries?: number;
    intervalMs?: number;
  }
  
  export interface WompiTransactionData {
    id: string;
    status: string;
    reference?: string;
    amount_in_cents?: number;
    currency?: string;
    customer_email?: string;
    [key: string]: any;
  }
  
  export interface ProcessCardPaymentParams {
    card: TokenizeCardParams;
    tx: Omit<CreateWompiTransactionParams, 'card_token' | 'signature'>;
  }
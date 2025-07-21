import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { TokenizeCardParams,CreateWompiTransactionParams, PollTransactionStatusParams, WompiTransactionData } from './wompi.interfaces';
import * as crypto from 'crypto';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);
  private readonly http: AxiosInstance;
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integrationKey: string;

  constructor() {
    this.baseUrl = process.env.WOMPI_BASE_URL ?? 'https://api-sandbox.co.uat.wompi.dev/v1';
    this.publicKey = process.env.WOMPI_PUBLIC_KEY ?? '';
    this.privateKey = process.env.WOMPI_PRIVATE_KEY ?? '';
    this.integrationKey = process.env.WOMPI_INTEGRATE_KEY ?? '';
    this.http = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async tokenizeCard(params: TokenizeCardParams): Promise<string> {
    const response = await this.http.post(
      '/tokens/cards',
      params,
      { headers: { Authorization: `Bearer ${this.publicKey}` } },
    );
  
    const token = response.data?.data?.id;
    if (!token) {
      throw new Error('Could not get the card token from Wompi.');
    }
  
    return token;
  }
  

  async createTransaction(params: Omit<CreateWompiTransactionParams, 'signature'>): Promise<string> {
    const signature = this.generateSignature(params.reference, params.amount_in_cents, params.currency);
    const response = await this.http.post(
      '/transactions',
      { ...params, signature },
      { headers: { Authorization: `Bearer ${this.privateKey}` } },
    );
    return response.data?.data?.id;
  }
  
  async pollTransactionStatus(params: PollTransactionStatusParams): Promise<boolean> {
    const { transactionId } = params;
    const startTime = Date.now();
    const timeoutMs = 60 * 1000;
    const intervalMs = 2 * 1000;

    this.logger.log(`Starting to poll transaction: ${transactionId}`);

    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await this.http.get<{ data: WompiTransactionData }>(
          `/transactions/${transactionId}`,
          { headers: { Authorization: `Bearer ${this.publicKey}` } },
        );

        const transaction = response.data.data;

        if (transaction.status !== 'PENDING') {
          if (transaction.status === 'APPROVED') {
            this.logger.log(`Transaction ${transactionId} was APPROVED.`);
            return true;
          } else {
            this.logger.warn(`Transaction ${transactionId} finished with status: ${transaction.status}.`);
            return false;
          }
        }

        this.logger.log(`Transaction ${transactionId} is still PENDING. Retrying in ${intervalMs / 1000}s...`);

      } catch (error) {
        this.logger.error(`Error polling transaction ${transactionId}:`, error.stack);
        return false;
      }

      await sleep(intervalMs);
    }

    this.logger.warn(`Polling timed out for transaction ${transactionId}. Status remained PENDING.`);
    return false;
  }

  generateSignature(reference: string, amountInCents: number, currency: string): string {
    const payload = `${reference}${amountInCents}${currency}${this.integrationKey}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}

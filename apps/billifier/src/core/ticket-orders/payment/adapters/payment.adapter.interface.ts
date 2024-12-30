import { MetaData } from "../dto";

export interface IPaymentAdapter {
  /**
   * Effectue un paiement.
   * @param amount Montant à payer.
   * @param metadata Informations supplémentaires pour le paiement.
   * @returns Une URL de confirmation ou les détails du paiement.
   */
  makePayment(amount: number, metadata?: MetaData): Promise<string>;

  /**
   * Vérifie le statut d'une transaction.
   * @param transactionId ID unique de la transaction.
   * @returns Le statut de la transaction.
   */
  checkTransactionStatus(transactionId: string): Promise<string>;

  /**
   * Annule une transaction.
   * @param transactionId ID unique de la transaction.
   * @returns Confirmation d'annulation.
   */
  cancelTransaction(transactionId: string): Promise<any>;

  /**
   * Rembourser une transaction.
   * @param transactionId ID unique de la transaction.
   * @returns Confirmation de remboursement.
   */
  refundTransaction(transactionId: string): Promise<any>;
}

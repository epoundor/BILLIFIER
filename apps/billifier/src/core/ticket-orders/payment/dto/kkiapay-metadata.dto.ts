import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { MetaData } from './metadata.dto';

// Métadonnées spécifiques pour Kkiapay
export class KkiapayMetadata extends MetaData {
  //   @IsNumber()
  //   amount: number; // Montant à payer

  @IsArray()
  authorized_payment_source: string[] = ['momo']; // Moyens de paiement (ex: [“card”, “momo”])

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  callback_url: string; // Lien webhook en cas de succès de paiement

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  failed_callback?: string; // Lien webhook en cas d’échec de paiement

//   target: string = "BILLIFIER"; 

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string; // Numéro pour envoi de lien via SMS (sans code pays)

  @IsString()
  @IsNotEmpty()
  country: string = '229'; // Code pays (Ex: 299, 225)

  @IsOptional()
  @IsBoolean()
  notifyBySms?: boolean; // Indiquer si le lien doit être envoyé par SMS sur le numéro (phone) renseigner dans la payload
}

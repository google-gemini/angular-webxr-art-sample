import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable( {
  providedIn: 'root',
} )
export class SpeechService {
  listen ( lang: string ): Promise<string> {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.start();


    return new Promise( ( resolve, reject ) => {
      recognition.onresult = ( event: any ) => {
        resolve( event.results[0][0].transcript );
      };
      recognition.onend = () => { recognition.stop(); };
      recognition.onerror = reject;
    } );
  }

  say ( text: string, lang?: string ): Promise<void> {
    const utterance = new SpeechSynthesisUtterance( text );
    utterance.lang = lang || 'en-US';
    return new Promise( ( resolve ) => {
      utterance.onend = () => resolve();
      speechSynthesis.speak( utterance );
    } );
  }

  readonly languages = [
    { label: 'Afrikaans', lang: 'af-ZA' },
    { label: 'Bahasa Indonesia', lang: 'id-ID' },
    { label: 'Bahasa Melayu', lang: 'ms-MY' },
    { label: 'Català', lang: 'ca-ES' },
    { label: 'Čeština', lang: 'cs-CZ' },
    { label: 'Deutsch', lang: 'de-DE' },
    { label: 'English (Australia)', lang: 'en-AU' },
    { label: 'English (Canada)', lang: 'en-CA' },
    { label: 'English (India)', lang: 'en-IN' },
    { label: 'English (New Zealand)', lang: 'en-NZ' },
    { label: 'English (South Africa)', lang: 'en-ZA' },
    { label: 'English (United Kingdom)', lang: 'en-GB' },
    { label: 'English (United States)', lang: 'en-US' },
    { label: 'Español (Argentina)', lang: 'es-AR' },
    { label: 'Español (Bolivia)', lang: 'es-BO' },
    { label: 'Español (Chile)', lang: 'es-CL' },
    { label: 'Español (Colombia)', lang: 'es-CO' },
    { label: 'Español (Costa Rica)', lang: 'es-CR' },
    { label: 'Español (Ecuador)', lang: 'es-EC' },
    { label: 'Español (El Salvador)', lang: 'es-SV' },
    { label: 'Español (España)', lang: 'es-ES' },
    { label: 'Español (Estados Unidos)', lang: 'es-US' },
    { label: 'Español (Guatemala)', lang: 'es-GT' },
    { label: 'Español (Honduras)', lang: 'es-HN' },
    { label: 'Español (México)', lang: 'es-MX' },
    { label: 'Español (Nicaragua)', lang: 'es-NI' },
    { label: 'Español (Panamá)', lang: 'es-PA' },
    { label: 'Español (Paraguay)', lang: 'es-PY' },
    { label: 'Español (Perú)', lang: 'es-PE' },
    { label: 'Español (Puerto Rico)', lang: 'es-PR' },
    { label: 'Español (República Dominicana)', lang: 'es-DO' },
    { label: 'Español (Uruguay)', lang: 'es-UY' },
    { label: 'Español (Venezuela)', lang: 'es-VE' },
    { label: 'Euskara', lang: 'eu-ES' },
    { label: 'Français', lang: 'fr-FR' },
    { label: 'Galego', lang: 'gl-ES' },
    { label: 'Hrvatski', lang: 'hr_HR' },
    { label: 'IsiZulu', lang: 'zu-ZA' },
    { label: 'Íslenska', lang: 'is-IS' },
    { label: 'Italiano (Italia)', lang: 'it-IT' },
    { label: 'Italiano (Svizzera)', lang: 'it-CH' },
    { label: 'Magyar', lang: 'hu-HU' },
    { label: 'Nederlands', lang: 'nl-NL' },
    { label: 'Norsk bokmål', lang: 'nb-NO' },
    { label: 'Polski', lang: 'pl-PL' },
    { label: 'Português (Brasil)', lang: 'pt-BR' },
    { label: 'Português (Portugal)', lang: 'pt-PT' },
    { label: 'Română', lang: 'ro-RO' },
    { label: 'Slovenčina', lang: 'sk-SK' },
    { label: 'Suomi', lang: 'fi-FI' },
    { label: 'Svenska', lang: 'sv-SE' },
    { label: 'Türkçe', lang: 'tr-TR' },
    { label: 'български', lang: 'bg-BG' },
    { label: 'Pусский', lang: 'ru-RU' },
    { label: 'Српски', lang: 'sr-RS' },
    { label: '한국어', lang: 'ko-KR' },
    { label: '中文 (普通话 (中国大陆))', lang: 'cmn-Hans-CN' },
    { label: '中文 (普通话 (香港))', lang: 'cmn-Hans-HK' },
    { label: '中文 (中文 (台灣))', lang: 'cmn-Hant-TW' },
    { label: '中文 (粵語 (香港))', lang: 'yue-Hant-HK' },
    { label: '日本語', lang: 'ja-JP' },
    { label: 'Lingua latīna', lang: 'la' },
  ];

}

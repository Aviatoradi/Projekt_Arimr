import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  selectedDepartment: { name: string } | null = null; // Wybrany departament
  selectedGoals: any[] = []; // Cele wybranego departamentu
  selectedGoal: any = null; // Pojedynczy wybrany cel
  savedData: any[] = []; // Zapisane dane
  

  
    // Lista wspólnych zadań dla różnych celów
  wspolneZadania1 = [
        'Opiniowanie legislacji.\n',
        'Przygotowanie: wymagań/założeń do systemu IT, wzorów dokumentów, książek procedur i instrukcji.\n',
        'Testy aplikacji/systemu; wdrożenie funkcjonalności.\n',
        'Szkolenia pracowników odpowiedzialnych za obsługę wniosków.\n',
        'Opracowanie prognoz wydatków.\n', 
        'Przeprowadzenie naboru wniosków.\n',
        'Wprowadzenie i kontrola kompletności.\n',
        'Kontrola administracyjna wniosków (w tym kontrola na miejscu/wizytacji).\n', 
        'Wydanie decyzji.\n',
        'Bieżący nadzór/monitoring/raportowanie postępu w obsłudze wniosków.\n'
  ];
  wspolneZadania2 = [
      'Planowanie – opracowanie założeń planistycznych dla zobowiązań i nowych kampani, z uwzglednieniem wysokości środków przyznanych przez Ministra RiRW. \n',
      'Monitoring realizacji płatności.\n',
      'Monitoring wykorzystania środków z dotacji przynanych na dany rok.\n',
      'Bieżąca weryfikacja kwot w planie finansowym Agencji i zgłaszanie zmian do planu finansowego Agencji na dany rok.\n',
  ];


  departments = [
    {
      name: 'DPB',
      goals: [
        {
          name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach płatności obszarowych (PROW 2014-2020 i PS WPR 2023-2027)',
          metrics: [
            {
              name: 'Planowana na dany rok kalendarzowy liczba rozpatrzonych wniosków o przyznanie płatności obszarowych PROW* (% spraw z  wydaną decyzją).',
              description: '* pod pojęciem płatności obszarowe PROW uwzględnione zostaną: płatności ONW, rolnośrodowiskowo klimatyczne (PROW 2014-2020, PS WPR 2023-2027), rolnictwo ekologiczne (PROW 2014-2020, PS WPR 2023-2027) oraz płatności zalesieniowe (PROW 2004-2006, PROW 2007-2013, PROW 2014-2020, PS WPR 2023-2027). \nOpis: Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach płatności obszarowych PROW*, obsługiwanych w roku kalendarzowym 2025.. Poziom realizacji w %.. (Do obliczenia miernika brane są pod uwagę wnioski z kampanii 2025 roku, dla których obsługa zostanie zakończona do 31.12.2025 r. oraz te wnioski z kampanii 2024 roku, których obsługa nie została zakończona do dnia 31.12.2024 roku. Należy zaznaczyć, iż w ramach PS WPR 2023 - 2027 co do zasady decyzje administracyjne powinny zostać wydane w terminie do 31 maja roku następującego po roku złożenia wniosku).', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },
        {
          name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach PS WPR 2023-2027',
          metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:)',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą  w ramach, PS WPR 2023-2027', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },
        {
          name: ' Zapewnienie realizacji płatności w ramach płatności obszarowych  (PROW 2014-2020, PS WPR 2023-2027)',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności obszarowych PROW* na dany rok kalendarzowy (% spraw ze zrealizowaną płatnością).',
              description: '* Pod pojęciem płatności obszarowe PROW uwzględnione zostaną: płatności ONW, rolnośrodowiskowo klimatyczne (PROW 2014-2020, PS WPR 2023-2027), rolnictwo ekologiczne (PROW 2014-2020, PS WPR 2023-2027) oraz płatności zalesieniowe (PROW 2004-2006, PROW 2007-2013, PROW 2014-2020). (Do obliczenia miernika brane są pod uwagę wnioski z kampanii 2025 roku, dla których wypłata płatności końcowych nastąpi do 31.12.2025 r. oraz te wnioski z kampanii 2024 roku, których wypłata płatności końcowych nie została zakończona do dnia 31.12.2024 roku. Należy zaznaczyć, iż w ramach PS WPR 2023 - 2027 co do zasady realizacja płatności powinna nastąpić w terminie do 30 czerwca roku następującego po roku złożenia wniosku).', level: ''
            },
          ],
          tasks: [...this.wspolneZadania2
          ],
        },
      ],
    },


    

    {
      name: 'DDP',
      goals: [
        {
          name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach PS WPR 2023-2027',
          metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:)',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą w ramach, PS WPR 2023-2027', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },

        {
        name: 'Zapewnienie realizacji płatności w ramach PS WPR 2023-2027',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności bezpośrednich na dany rok kalendarzowy (% spraw ze zrealizowaną płatnością).',
              description: 'Kwota zrealizowanych płatności bezpośrednich do kwoty planowanej na dany rok. Poziom realizacji w %: (Do obliczenia miernika brane są pod uwagę wnioski z kampanii 2025 roku, dla których wypłata płatności końcowych nastąpi do 31.12.2025 r. oraz te wnioski z kampanii 2024 roku, których wypłata płatności końcowych nie została zakończona do dnia 31.12.2024 roku. Należy zaznaczyć, iż w ramach PS WPR 2023 - 2027 co do zasady realizacja płatności powinna nastąpić w terminie do 30 czerwca roku następującego po roku złożenia wniosku).', level: ''
            },
          ],
          tasks: [...this.wspolneZadania2
          ],
        }
      ],
    },




    {
      name: 'DDD',
      goals: [
        {
          name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach PS WPR 2023-2027',
          metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:)',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą  w ramach, PS WPR 2023-2027', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },
        
        {
        name: 'Zapewnienie realizacji płatności w ramach PS WPR 2023-2027',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności bezpośrednich na dany rok kalendarzowy (% spraw ze zrealizowaną płatnością).',
              description: 'Kwota zrealizowanych płatności bezpośrednich do kwoty planowanej na dany rok. Poziom realizacji w %: (Do obliczenia miernika brane są pod uwagę wnioski z kampanii 2025 roku, dla których wypłata płatności końcowych nastąpi do 31.12.2025 r. oraz te wnioski z kampanii 2024 roku, których wypłata płatności końcowych nie została zakończona do dnia 31.12.2024 roku. Należy zaznaczyć, iż w ramach PS WPR 2023 - 2027 co do zasady realizacja płatności powinna nastąpić w terminie do 30 czerwca roku następującego po roku złożenia wniosku).', level: ''
            },
          ],
          tasks: [...this.wspolneZadania2
          ],
        },
      
        {
        name: 'Zapewnienie realizacji płatności w ramach  PROW 2014 - 2020',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%).',
              description: 'Poziom realizacji w %.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.', level: ''
            },
          ],
          tasks: [...this.wspolneZadania2
          ],
        }
      ],
    },
    



        {
          name: 'DDI',
          goals: [
            {
            name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach PS WPR 2023-2027',
            metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:)',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą  w ramach, PS WPR 2023-2027', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
            },

          {
            name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach KPO',
            metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:)',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą w ramach KPO.', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
            },

            {
              name: 'Zapewnienie realizacji płatności w ramach  PROW 2014-2020',
              metrics: [
                {
                  name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%).',
                  description: 'Poziom realizacji w %.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.', level: ''
              },
              ],
              tasks: [...this.wspolneZadania2
              ],
            },  

            {
              name: 'Zapewnienie realizacji płatności w ramach KPO',
              metrics: [
                {
                  name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%).',
                  description: 'Poziom realizacji w %.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.', level: ''
              },
              ],
              tasks: [...this.wspolneZadania2
              ],
            }, 
      ],
    },

    {
      name: 'DRR',
      goals: [
        {
          name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach PS WPR 2023-2027',
          metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:)',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą  w ramach, PS WPR 2023-2027', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },
        
        {
        name: 'Zapewnienie realizacji płatności w ramach PS WPR 2023-2027',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności bezpośrednich na dany rok kalendarzowy (% spraw ze zrealizowaną płatnością).',
              description: 'Kwota zrealizowanych płatności bezpośrednich do kwoty planowanej na dany rok. Poziom realizacji w %: (Do obliczenia miernika brane są pod uwagę wnioski z kampanii 2025 roku, dla których wypłata płatności końcowych nastąpi do 31.12.2025 r. oraz te wnioski z kampanii 2024 roku, których wypłata płatności końcowych nie została zakończona do dnia 31.12.2024 roku. Należy zaznaczyć, iż w ramach PS WPR 2023 - 2027 co do zasady realizacja płatności powinna nastąpić w terminie do 30 czerwca roku następującego po roku złożenia wniosku).', level: ''
            },
          ],
          tasks: [...this.wspolneZadania2
          ],
        },
      ],
    },


    {
      name: 'DOPI',
      goals: [
        {
            name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach KPO',
            metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:)',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą w ramach KPO.', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },
        
        {
              name: 'Zapewnienie realizacji płatności w ramach  PROW 2014-2020',
              metrics: [
                {
                  name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%).',
                  description: 'Poziom realizacji w %.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.', level: ''
              },
              ],
              tasks: [...this.wspolneZadania2
              ],
        },
        {
              name: 'Zapewnienie realizacji płatności w ramach KPO',
              metrics: [
                {
                  name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%).',
                  description: 'Poziom realizacji w %.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.', level: ''
              },
              ],
              tasks: [...this.wspolneZadania2
              ],
        }, 
      ],
    },




{
      name: 'DWK',
      goals: [
        
        {
        name: 'Zapewnienie skutecznej obsługi wniosków o pomoc  w ramach  POMOCY KRAJOWEJ ',
          metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%:).',
              description: 'Liczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach poszczególnych instrumentów pomocowych z uwzględnieniem podziału na departamenty odpowiedzialne za nadzór nad ich prawidłowym wdrażaniem w danym roku kalendarzowym. Do puli wszystkich wniosków branych pod uwagę wchodziły będą wszystkie, których zakończenie oceny (zgodnie z obowiązującymi przepisami prawa) powinno zakończyć się do końca danego roku kalendarzowego Planowana na dany rok kalendarzowy liczba wniosków z zakończoną obsługą w ramach POMOCY KRAJOWEJ.', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },

        {
        name: 'Zapewnienie realizacji płatności w ramach POMOCY KRAJOWEJ',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%)',
              description: 'Poziom realizacji w %.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },

        {
        name: 'Zapewnienie realizacji Rocznego Planu Kontroli ',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%)',
              description: 'Poziom realizacji w %.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.', level: ''
            },
          ],
          tasks: [
            'Sporządzenie Rocznego Planu Kontroli uwzględniającego obszary szczególnie narażone na występowanie nieprawidłowości/nadużyć.',
            'Realizacja zaplanowanych kontroli zgodnie z zatwierdzonym Rocznym Planem Kontroli.',
            'Wykonywanie kontroli doraźnych.',
          ],
        },

        {
        name: 'Zapewnienie realizacji obowiązków Agencji Płatniczej związanych z przekazywaniem kwartalnych raportów nieprawidłowości do KE, zgodnie z obowiązującymi procedurami.',
          metrics: [
            {
              name: 'Poziom zaraportowania nieprawidłowości (%).',
              description: 'Wskaźnik procentowy liczba spraw, w których sporządzono raport nieprawidłowości (zaraportowanych) w stosunku do spraw kwalifikujących się do raportowania, poprawnie i kompletnie zaewidencjonowanych w rejestrach nieprawidłowości w danym okresie sprawozdawczym.', level: ''
            },
          ],
          tasks: [
            'Analiza informacji w rejestrach i konsultacje z jednostkami organizacyjnymi.',
            'Weryfikacja danych w systemie EBS, uzgadnianie danych z Księgą Dłużników i IACS Plus.',
            'Wykonywanie kontroli wewnętrznych w jednostkach organizacyjnych ARiMR oraz podmiotach wdrażających. ',
          ],
        },

      ],
    },




    {
      name: 'DWR',
      goals: [
        
        {
          name: 'Zapewnienie skutecznej obsługi wniosków o pomoc w ramach FER 2021-2027 ',
          metrics: [
            {
              name: 'Poziom wniosków rozpatrzonych (pozytywnie i negatywnie) (%):',
              description: 'dla Priorytetu 1 w ramach dz. 1.8 Tymczasowe zaprzestanie działalności połowowej.\nOpis:\nLiczba wniosków rozpatrzonych do liczby wniosków złożonych w ramach naborów z dz. 1.8 Tymczasowe zaprzestanie działalności połowowej w roku 2025. Do puli wniosków branych pod uwagę wchodziły będą wszystkie, których obsługa (zgodnie z obowiązującymi przepisami prawa) powinna zakończyć się w danym roku kalendarzowym. Poziom miernika w %: >=90 przy założeniu, że 100% = 455 liczba wniosków o dofinansowanie rozpatrzonych w ramach dz. 1.8 w danym roku.', level: ''
            },
          ],
          tasks: [...this.wspolneZadania1
          ],
        },

        {
          name: 'Zapewnienie realizacji płatności w ramach FER 2021-2027',
          metrics: [
            {
              name: 'Poziom zrealizowanych płatności na dany rok kalendarzowy (%).',
              description: 'Poziom realizacji w %:\nKwota zrealizowanych płatności do kwoty planowanej na dany rok.\nPoziom miernika w %: >=90 planowana kwota płatności w ramach złożonych WoP\nPoziom zrealizowanych płatności na dany rok kalendarzowy (%)  dla Priorytetu 2 w ramach działania 2.3 Akwakultura środowiskowa\nPoziom miernika w %: >=90 planowana kwota płatności w ramach złożonych WoP z  działania 2.3 Akwakultura środowiskowa przy założeniu, że 100% = 70 333 170,49 zł.\nKwota zrealizowanych płatności do kwoty planowanej na dany rok  w ramach działania 2.3 Akwakultura środowiskowa.', level: ''
            },
          ],
          tasks: [...this.wspolneZadania2
          ],
        },
      ],
    }

  ];

  constructor() {}
}

export interface ICasesModel {
  sno: number;
  date: string;
  time: string;
  state: string;
  confirmedIndians: number;
  confirmedForeigners: number;
  cured: number;
  deaths: number;
  confirmed: number;
}

export interface ITestsModel {
  _id: string;
  date: string;
  state: string;
  totalSamples: number;
  negativeSamples: number;
  positiveSamples: number;
}

export interface IVaccinationsModel {
  _id: string;
  updatedOn: string;
  state: string;
  totalDosesAdministered: number;
  totalSessionsConducted: number;
  totalSites: number;
  firstDoseAdministered: number;
  secondDoseAdministered: number;
  malesVaccinated: number;
  femalesVaccinated: number;
  transgendersVaccinated: number;
  totalCovaxinAdministered: number;
  totalCoviShieldAdministered: number;
  totalSputnikVAdministered: number;
  aefi: number;
  underFortyFive: number;
  fortyFiveToSixty: number;
  aboveSixty: number;
  totalIndividualsVaccinated: number;
}

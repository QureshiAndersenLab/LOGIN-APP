export interface IAction {
  label: string;
  icon?: string;
  link?: string;
}

export interface IPolicy {
  icon: string;
  name: string;
  status: 'Active' | 'Canceled';
  policyNumber: string;
  baseContractNumber?: string;
  validFrom: string;
  actions: IAction[];
}

export interface ICreditCardPolicyGroup {
  cardName: string;
  number: string;
  policies: IPolicy[];
}

export interface IPoliciesGroupState {
  active: ICreditCardPolicyGroup[];
  inactive: ICreditCardPolicyGroup[];
}

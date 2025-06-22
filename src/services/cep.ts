export interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export class CEPError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CEPError";
  }
}

export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, "");
  return cleanCEP.length === 8;
};

export const formatCEP = (cep: string): string => {
  const cleanCEP = cep.replace(/\D/g, "");
  return cleanCEP.replace(/(\d{5})(\d{3})/, "$1-$2");
};

export const fetchAddressByCEP = async (cep: string): Promise<AddressData> => {
  const cleanCEP = cep.replace(/\D/g, "");

  if (!validateCEP(cleanCEP)) {
    throw new CEPError("CEP deve conter exatamente 8 dígitos");
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);

    if (!response.ok) {
      throw new CEPError("Erro ao consultar CEP");
    }

    const data: Address = await response.json();

    if ("erro" in data) {
      throw new CEPError("CEP não encontrado");
    }

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      cep: formatCEP(cleanCEP),
    };
  } catch (error) {
    if (error instanceof CEPError) {
      throw error;
    }
    throw new CEPError("Erro ao consultar CEP. Verifique sua conexão.");
  }
};

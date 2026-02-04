// Origin Sheet types - prepared for Supabase integration

export interface OriginSheetMetadata {
  creadoPor: string;
  fechaGuardado: string;
  fechaFormateada: string;
  verificadoPor: string | null;
}

export interface InformacionOrigen {
  rhinoCode: string | null;
  descripcion: string | null;
  claveExterna: string | null;
}

export interface PreparacionData {
  espesores: string[];
  espesorCustom: string | null;
  tolerancia: string | null;
  origen: string | null;
  origenCustom: string | null;
}

export interface DisenoArchivo {
  id: string;
  nombre: string;
  tipo: string;
  tamaño: number;
  url: string;
}

export interface DisenoData {
  archivos: DisenoArchivo[];
}

export interface CorteData {
  ejeX: string | null;
  ejeY: string | null;
  area: string | null;
}

export interface BarrenoItem {
  numero: number;
  posicionX: string | null;
  posicionY: string | null;
  diametro: string | null;
}

export interface BarrenosData {
  aplica: boolean;
  cantidad: number;
  barrenos: BarrenoItem[];
}

export interface TempladoData {
  tipoMolde: string | null;
  tipoProceso: string | null;
  radioCilindro: string | null;
}

export interface PulidoData {
  metrosLineales: string | null;
  tipoPulido: string | null;
}

export interface SerigrafiaData {
  aplica: boolean;
  color: string | null;
  defroster: {
    aplica: boolean;
    area: string | null;
  };
}

export interface MarcaData {
  marca: string | null;
  colorMarca: string | null;
  numeroMain: string | null;
  coordenadasMain: string | null;
}

export interface ObservacionesData {
  notas: string | null;
}

export interface OriginSheet {
  id: string;
  metadata: OriginSheetMetadata;
  InformacionOrigen: InformacionOrigen;
  Preparacion: PreparacionData;
  Diseno: DisenoData;
  Corte: CorteData;
  Barrenos: BarrenosData;
  Templado: TempladoData;
  Pulido: PulidoData;
  Serigrafia: SerigrafiaData;
  Marca: MarcaData;
  Observaciones: ObservacionesData;
}

// For Supabase table structure (future)
export interface OriginSheetRow {
  id: string;
  user_id: string;
  rhino_code: string | null;
  descripcion: string | null;
  clave_externa: string | null;
  data: Omit<OriginSheet, 'id' | 'InformacionOrigen'>;
  created_at: string;
  updated_at: string;
}

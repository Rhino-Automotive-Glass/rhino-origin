// Origin Sheet storage - localStorage implementation with Supabase-ready interface

import type { OriginSheet } from "@/types/originSheet";

const STORAGE_KEY = "rhino-origin-sheets";

// Storage interface - can be swapped for Supabase implementation
export interface OriginSheetStorage {
  save(sheet: OriginSheet): Promise<OriginSheet>;
  getAll(): Promise<OriginSheet[]>;
  getById(id: string): Promise<OriginSheet | null>;
  delete(id: string): Promise<void>;
}

// LocalStorage implementation
class LocalOriginSheetStorage implements OriginSheetStorage {
  async save(sheet: OriginSheet): Promise<OriginSheet> {
    const sheets = await this.getAll();
    const existingIndex = sheets.findIndex((s) => s.id === sheet.id);

    if (existingIndex >= 0) {
      sheets[existingIndex] = sheet;
    } else {
      sheets.push(sheet);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));
    return sheet;
  }

  async getAll(): Promise<OriginSheet[]> {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data) as OriginSheet[];
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<OriginSheet | null> {
    const sheets = await this.getAll();
    return sheets.find((s) => s.id === id) || null;
  }

  async delete(id: string): Promise<void> {
    const sheets = await this.getAll();
    const filtered = sheets.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}

// Future: Supabase implementation
// class SupabaseOriginSheetStorage implements OriginSheetStorage {
//   async save(sheet: OriginSheet): Promise<OriginSheet> {
//     const supabase = createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//
//     const { data, error } = await supabase
//       .from('origin_sheets')
//       .upsert({
//         id: sheet.id,
//         user_id: user?.id,
//         rhino_code: sheet.InformacionOrigen.rhinoCode,
//         descripcion: sheet.InformacionOrigen.descripcion,
//         clave_externa: sheet.InformacionOrigen.claveExterna,
//         data: sheet,
//       })
//       .select()
//       .single();
//
//     if (error) throw error;
//     return sheet;
//   }
//
//   async getAll(): Promise<OriginSheet[]> { ... }
//   async getById(id: string): Promise<OriginSheet | null> { ... }
//   async delete(id: string): Promise<void> { ... }
// }

// Export singleton instance
export const originSheetStorage = new LocalOriginSheetStorage();

// Helper to generate unique IDs
export function generateOriginSheetId(): string {
  return `os_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

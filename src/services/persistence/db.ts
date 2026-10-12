import Dexie, { type EntityTable } from 'dexie';
import { GameSave } from '@/game/types';

export interface StoredSaveRecord {
  id: string; // 'current_save'
  savedAt: string;
  version: number;
  data: GameSave;
}

/**
 * Lớp cơ sở dữ liệu IndexedDB sử dụng Dexie
 */
class SchoolGateDB extends Dexie {
  saves!: EntityTable<StoredSaveRecord, 'id'>;

  constructor() {
    super('SchoolGateGameDB');
    this.version(1).stores({
      saves: 'id, savedAt, version',
    });
  }
}

export const db = new SchoolGateDB();

import {
  type Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from './database.types';

export { Database, Tables, TablesInsert, TablesUpdate, Enums };

// Export convenience type helpers for easier access
export type Contact = Tables<'contacts'>;
export type FollowUp = Tables<'follow_ups'>;
export type Note = Tables<'notes'>;
export type Payment = Tables<'payments'>;
export type Program = Tables<'programs'>;
export type Session = Tables<'sessions'>;

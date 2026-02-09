export enum DayOfWeek {
  Lunes = 'Lunes',
  Martes = 'Martes',
  Miercoles = 'Miércoles',
  Jueves = 'Jueves',
  Viernes = 'Viernes'
}

export interface Task {
  id: string;
  content: string;
  day: DayOfWeek;
  createdAt: number;
  color: string;
}

export const DAYS: DayOfWeek[] = [
  DayOfWeek.Lunes,
  DayOfWeek.Martes,
  DayOfWeek.Miercoles,
  DayOfWeek.Jueves,
  DayOfWeek.Viernes
];

export const COLUMN_COLORS: Record<DayOfWeek, string> = {
  [DayOfWeek.Lunes]: 'bg-red-50 border-red-200 text-red-700',
  [DayOfWeek.Martes]: 'bg-orange-50 border-orange-200 text-orange-700',
  [DayOfWeek.Miercoles]: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  [DayOfWeek.Jueves]: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  [DayOfWeek.Viernes]: 'bg-blue-50 border-blue-200 text-blue-700',
};
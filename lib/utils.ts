import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database.
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

export const GOOGLE_MAPS_API_KEY: string =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export function explainLevel(level: number): string {
    switch (level) {
        case 0:
            return '沒興趣';
        case 1:
            return '新手';
        case 2:
            return '休閒';
        case 3:
            return '中階';
        case 4:
            return '進階';
        case 5:
            return '半職業';
        case 6:
            return '職業';
    }

    return '';
}

export function getSportEmoji(sport: string): string {
    switch (sport) {
        case 'soccer':
            return '⚽';
        case 'basketball':
            return '🏀';
        case 'tennis':
            return '🎾';
        case 'table tennis':
            return '🏓';
        case 'badminton':
            return '🏸';
    }

    return '';
}

export function calculateAge(birthday: string): number {
    const [by, bm, bd] = birthday.split('-').map((x) => parseInt(x));

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1; // Gets the month (0-based, so add 1).
    const d = now.getDate();

    if (m < bm || (m === bm && d < bd)) {
        return y - by - 1;
    }

    return y - by;
}

export interface EventType {
    id: string;
    email: string;
    sport: string;
    title: string;
    gender: number;
    age_min: number;
    age_max: number;
    level_min: number;
    level_max: number;
    lat: number;
    lng: number;
    location: string;
    participant_limit: number;
    start_time: string;
    end_time: string;
    remaining_spots: number;
}

export interface UserType {
    id: string;
    email: string;
    username: string;
    gender: number;
    birthday: string | null;
    distance: number;
    intro: string;
    badminton_level: number;
    basketball_level: number;
    soccer_level: number;
    table_tennis_level: number;
    tennis_level: number;
}

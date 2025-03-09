import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database.
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

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

export function datetime2str(datetime: Date | null): string {
    if (!datetime) {
        return '';
    }

    return (
        datetime.getFullYear().toString() +
        '-' +
        (datetime.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        datetime.getDate().toString().padStart(2, '0') +
        'T' +
        datetime.getHours().toString().padStart(2, '0') +
        ':' +
        datetime.getMinutes().toString().padStart(2, '0')
    );
}

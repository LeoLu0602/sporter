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

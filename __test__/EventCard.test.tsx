import EventCard from '@/components/EventCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('EventCard', () => {
    it('renders time correctly', () => {
        render(
            <EventCard
                isOwner={false}
                sport="soccer"
                title="足球@台中一中"
                startTime={new Date(2025, 3, 3, 15)}
                endTime={new Date(2025, 3, 3, 18)}
                location="一中足球場"
                openCard={() => {}}
            />
        );

        const startTime = screen.getByTestId('start-time').textContent;
        const endTime = screen.getByTestId('end-time').textContent;

        expect(startTime).toBe('4/3/25, 15:00');
        expect(endTime).toBe('4/3/25, 18:00');
    });
});
